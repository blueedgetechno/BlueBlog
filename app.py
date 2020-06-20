from flask import Flask,render_template,url_for,redirect,request
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug import secure_filename
import json,hashlib,os,random

images = []
for root, directories, files in os.walk("static/img/post"):
    for filename in files:
        images.append(filename)

def giveme():
    random.shuffle(images)
    return random.choice(images)

with open("templates/config.json", "r") as c:
    para = json.load(c)["para"]

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///posts.db'
db = SQLAlchemy(app)

class Posts(db.Model):
    id = db.Column(db.Integer, unique=True, primary_key=True)
    title = db.Column(db.String(200), nullable = False)
    content = db.Column(db.String(600), nullable = False)
    date = db.Column(db.DateTime, default=datetime.now)
    author = db.Column(db.String(200), default=para['user'])
    image = db.Column(db.String(30), default=giveme())

    def __repr__(self):
        return '<post %r>'%self.id

class Games(db.Model):
    id = db.Column(db.Integer, unique=True, primary_key=True)
    nick = db.Column(db.String(20), nullable=False)
    name = db.Column(db.String(20),nullable = False)
    dis = db.Column(db.String(200),nullable = False)

    def __repr__(self):
        return '<game %r>' % self.id


class Videos(db.Model):
    id = db.Column(db.Integer, unique=True, primary_key=True)
    title = db.Column(db.String(80), nullable=False)
    link = db.Column(db.String(200), nullable=False)

    def __repr__(self):
        return '<vid %r>' % self.id

def check(s):
    z = s.encode('ascii')
    return hashlib.sha256(z).hexdigest()==para['key']


def isalready(s):
    return s in images

@app.errorhandler(404)
def page_not_found(e):
    return redirect('/error')

@app.route('/')
def index():
    posts = Posts.query.order_by(Posts.date.desc()).all()
    tp = para['nofpost']
    last=len(posts)//tp + (len(posts)%tp!=0)
    if last==1:
        return render_template('index.html', posts=posts, prev="#", next="#")

    page = request.args.get('page')
    try:
        page = int(page)
    except:
        page = 0

    posts = posts[page*tp:min((page+1)*tp,len(posts))]

    prev = "?page="+str(page-1) if page>0 else "#"
    next = "?page="+str(page+1) if page<last-1 else "#"

    return render_template('index.html',posts=posts,prev=prev,next=next)


@app.route('/edit')
def edit():
    posts = Posts.query.order_by(Posts.date.desc()).all()
    return render_template('edit.html',posts=posts)


@app.route('/editor')
def editor():
    games = Games.query.all()
    return render_template('editor.html', games=games)


@app.route('/deletegame/<string:id>', methods=['GET', 'POST'])
def deletegame(id):
    try:
        game = Games.query.get_or_404(id)
    except:
        return redirect('/error')

    if request.method == 'POST':
        password = request.form['password']
        if check(password):
            try:
                try:
                    os.remove(os.path.join('static/img/games/', game.nick + '.png'))
                    os.remove(os.path.join('static/js/games/', game.nick + '.js'))
                except:
                    return redirect('/error')

                db.session.delete(game)
                db.session.commit()
                return redirect('/editor')

            except:
                return redirect('/error')
        else:
            return render_template('/deletegame.html', game=game, res=1)
    else:
        return render_template('deletegame.html', game=game, res=0)


@app.route('/editor/<string:id>', methods=['GET', 'POST'])
def editgame(id):
    try:
        game = Games.query.get_or_404(id)
    except:
        return redirect('/error')

    if request.method == 'POST':
        password = request.form['password']
        if check(password):
            try:
                os.remove(os.path.join('static/img/games/', game.nick + '.png'))
                os.remove(os.path.join('static/js/games/', game.nick + '.js'))
            except:
                return redirect('/error')

            game.name = request.form['name']
            game.nick = request.form['nick']
            game.dis = request.form['discrip']

            image = request.files['imagefile']
            jsfile = request.files['jsfile']

            image.save(os.path.join('static/img/games/',secure_filename(image.filename)))
            jsfile.save(os.path.join('static/js/games/',secure_filename(jsfile.filename)))

            try:
                db.session.commit()
                return redirect('/play')
            except:
                return redirect('/error')
        else:
            return render_template('editgame.html', game=game, res=1)
    else:
        return render_template('editgame.html', game=game, res=0)

@app.route('/edit/<string:id>',methods=['GET','POST'])
def editblog(id):
    try:
        post = Posts.query.get_or_404(id)
    except:
        return redirect('/error')

    if request.method == 'POST':
        post.title = request.form['title']
        post.content = request.form['content'].lstrip(' ')
        password = request.form['password']
        if check(password):
            try:
                db.session.commit()
                return redirect('/')
            except:
                return redirect('/error')
        else:
            return render_template('/editblog.html',post=post, res=1)
    else:
        return render_template('editblog.html', post=post, res=0)


@app.route('/delete/<string:id>', methods=['GET', 'POST'])
def delete(id):
    try:
        post = Posts.query.get_or_404(id)
    except:
        return redirect('/error')

    if request.method == 'POST':
        password = request.form['password']
        if check(password):
            try:
                db.session.delete(post)
                db.session.commit()
                return redirect('/edit')
            except:
                return redirect('/error')
        else:
            return render_template('/delete.html', post=post, res=1)
    else:
        return render_template('delete.html', post=post, res=0)


@app.route('/about')
def about():
    return render_template('about.html')


@app.route('/add',methods=['GET','POST'])
def addvideo():
    if request.method == 'POST':
        title = request.form['title']
        link = request.form['link']
        password = request.form['password']
        if check(password):
            newvideo = Videos(title=title,link=link)
            try:
                db.session.add(newvideo)
                db.session.commit()
                return redirect('/video')
            except:
                return redirect('/error')
        else:
            return render_template('addvideo.html',res=1)
    else:
        return render_template('addvideo.html',res=0)

@app.route('/video')
def video():
    videos = Videos.query.all()
    return render_template('video.html',videos = videos)


@app.route('/editvideo')
def editvideo():
    videos = Videos.query.all()
    return render_template('editvideo.html', videos=videos)


@app.route('/deletevideo/<string:id>', methods=['GET', 'POST'])
def deletevideo(id):
    try:
        video = Videos.query.get_or_404(id)
    except:
        return redirect('/error')

    if request.method == 'POST':
        password = request.form['password']
        if check(password):
            try:
                db.session.delete(video)
                db.session.commit()
                return redirect('/editvideo')
            except:
                return redirect('/error')
        else:
            return render_template('/deletevideo.html', video=video, res=1)
    else:
        return render_template('deletevideo.html', video=video, res=0)


@app.route('/play')
def menu():
    games = Games.query.all()
    return render_template('play.html',games=games)

@app.route('/upload', methods=['GET','POST'])
def upload():
    if request.method == 'POST':
        password = request.form['password']
        name = request.form['name']
        nick = request.form['nick']
        dis = request.form['discrip']

        if check(password):
            try:
                image = request.files['imagefile']
                jsfile = request.files['jsfile']
                image.save(os.path.join('static/img/games/',secure_filename(image.filename)))
                jsfile.save(os.path.join('static/js/games/',secure_filename(jsfile.filename)))
                newgame = Games(name=name,nick=nick,dis=dis)
                db.session.add(newgame)
                db.session.commit()
                return redirect('/play')
            except :
                return redirect('/error')
        else:
            return render_template('upload.html',res=1)
    else:
        return render_template('upload.html',res=0)


@app.route('/error')
def error():
    return render_template('404.html')

@app.route('/post',methods=['GET','POST'])
def post():
    if request.method == 'POST':
        title = request.form['title']
        content = request.form['content']
        password = request.form['password']
        random_check = request.form.get('random')
        if check(password):
            content = content.lstrip(' ')
            if not random_check:
                try:
                    image = request.files['postimage']
                    if isalready(image.filename):
                        return render_template('/postblog.html', res=0, res2=1)

                    image.save(os.path.join('static/img/post/',secure_filename(image.filename)))
                except:
                    return redirect('/error')

                newpost = Posts(title=title, content=content,image=image.filename)
            else:
                newpost = Posts(title=title, content=content)

            try:
                db.session.add(newpost)
                db.session.commit()
                return redirect('/')
            except:
                return redirect('/error')
        else:
            return render_template('/postblog.html',res=1,res2=0)
    else:
        return render_template('/postblog.html',res=0,res2=0)


@app.route('/admin/')
def admin():
    return render_template('admin.html')


@app.route('/play/<int:id>')
def play(id):
    try:
        game = Games.query.get_or_404(id)
    except:
        return redirect('/error')

    return render_template('games/playgame.html',game=game)


@app.route('/play/full/<int:id>')
def playfull(id):
    try:
        game = Games.query.get_or_404(id)
    except:
        return redirect('/error')

    return render_template('games/fullsc.html', game=game)


@app.route("/js/<string:file>")
def index_js(file):
    with open("static/js/"+file,"r") as f:
        data=f.read()

    return data

if __name__=='__main__':
    app.run(debug=True)
