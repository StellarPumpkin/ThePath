const express = require('express'),
    port = process.env.PORT || 3000,
    path = require('path'),
    app = express(),
    cookieParser = require('cookie-parser'),
    cookieSession = require('express-session'),
    Timeline = require('./models/timeline.js'),
    Milestone = require('./models/milestone.js'),
    User = require('./models/users.js');

app.use(express.urlencoded({
    extended: true
}));
app.use(cookieParser());
app.use(cookieSession({
    name: 'pathCookie',
    secret: 'secretSignature'
}));

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'views')));
//app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));



//Setup middleware that checks if user is logged in or not
let checkLoggedIn = (req, res, next) => {
    console.log(`this is userCookie: ${req.cookies.pathCookie}`);
    console.log(`This is the user: ${req.session.user}`);
    //here it checks if both cookie and user exist already, creates automatic cookie?

    if (req.cookies.pathCookie && req.session.user) {
        console.log('checkLoggedIn fount that user ws already logged in');
        res.redirect('/profile');
    }
    console.log('checkLoggedIn found that user is new here');
    next()
};
app.get('/', checkLoggedIn, (req, res) => {
    res.redirect('/login');
});

app.route('/register')
    .get(checkLoggedIn, (req, res) => {
        res.render('register')
    })
    .post((req, res) => {
        User.create({
                username: req.body.username,
                email: req.body.email,
                password: req.body.password
            }).then((retrivedUser) => {
                req.session.user = retrivedUser.dataValues;
                res.redirect('/profile');
            })
            .catch((error) => {
                console.log(`Something went wrong: ${error.stack}`);
                res.redirect('/register');
            });
    });

//login page
app.route('/login')
    .get(checkLoggedIn, (req, res) => {
        res.render('login');
    })
    .post((req, res) => {
        let username = req.body.username,
            password = req.body.password;
        console.log(`login username: ${username}`);
        console.log(`password username: ${password}`);

        User.findOne({
                where: {
                    username: username,
                    password: password
                }
            })
            .then((retrivedUser) => {
                req.session.user = retrivedUser.dataValues;
                console.log('This is the user after login:', req.session.user);
                res.redirect('/profile');
            })
            .catch((error) => {
                console.log(`Something went wrong: ${error.stack}`);
                res.render('error');
            })
    });

//profile page
app.get('/profile', (req, res) => {
    if (req.session.user && req.cookies.pathCookie) {
        res.render('profile', {
            username: req.session.user.username
        });

    } else {
        res.redirect('/login');
    }
});

//The actual path functionality

//render create form
app.get('/create', (req, res) => {
    res.render('createform')
});
//create Timeline Goal, retrive and redirect to path

app.post('/create', (req, res) => {
    if (req.session.user && req.cookies.pathCookie) {
        console.log(`this is userCookie on create: ${req.cookies.pathCookie}`);
        console.log('This is the user on create:', req.session.user);

        Timeline.create({
                Goal: req.body.Goal,
                userId: req.session.user.id
            }).then((retrivedTimeline) => {
                req.session.user = retrivedTimeline.dataValues
                res.redirect('/path/' + retrivedTimeline.dataValues.id)
                console.log('we have redirected')
            })
            .catch((error) => {
                console.log(`Something went wrong: ${error.stack}`);
            })
    }
})


//create a milestone, retrive milestone, add milestone (So what here?)
// app.route('/path')
//     .get((req, res) => {
//         console.log('This is the user on path:', req.session.user);
//         res.render('path', {
//             path: req.session.user.Goal
//         })
//     })
//     .post((req, res) => {
//         Milestone.create({
//             Body: req.body.Body,
//         }).then((retrivedMilestone) => {
//             res.render('path', {
//                 path: req.session.user.Goal,
//                 myMilestone: retrivedMilestone.dataValues

//             })

//         }).catch((error) => {
//             console.log(`Something is wrong: ${error.stack}`);
//         })
//     });



app.get('/myallpaths', (req, res) => {
    if (req.session.user && req.cookies.pathCookie) {
        Timeline.findAll({
                where: {
                    userId: req.session.user.id
                }
            }).then((retrivedTimlines) => {
                res.render('allpaths.ejs', {
                    allTimelines: retrivedTimlines
                })
            })

            , (error) => {
                console.log(`Something went wrong when reading with findAll(): ${error.stack}`)
            }
    }
})

app.get('/path/:id', (req, res) => {
    if (!req.session.user && !req.cookies.pathCookie) {
        res.redirect('/login');
    }
    let id = req.params.id;

    Timeline.findById(id).then((path) => {
        Milestone.findAll({
            where: {
                timelineId: id
            }
        }).then((retrievedMilestones) => {
            res.render('path', {
                path: path.dataValues.Goal,
                pathId: path.dataValues.id,
                milestones: retrievedMilestones
            })
        })

    }).catch((error) => {
        console.log(`Something is wrong: ${error.stack}`);
    })

})

app.post('/path/:id', (req, res) => {
    if (!req.session.user && !req.cookies.pathCookie) {
        res.redirect('/login');
    }

    console.log('This is the request from client side:', req.body);

    let id = req.params.id;

    Milestone.create({
        Body: req.body.Body,
        timelineId: id
    }).then(() => {
        Milestone.findAll({
            where: {
                timelineId: id
            }
        }).then((retrievedMilestones) => {
            res.render('path', {
                path: req.session.user.Goal,
                pathId: id,
                milestones: retrievedMilestones
            })
    })

    
    }),(error) => {
        console.log(`Something went wrong when reading with findAll(): ${error.stack}`)
    }
})































app.get('/logout', (req, res) => {
    if (req.session.user && req.cookies.pathCookie) {
        res.clearCookie('pathCookie');
        console.log('Cookie has been delted');
        res.redirect('/');
    } else {
        res.redirect('/login');
    }
});

app.listen(port, (req, res) => console.log(`Up on: ${port}`));