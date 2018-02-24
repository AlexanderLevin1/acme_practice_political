// require middleware
const express = require('express');
const app = express();
const path = require('path');
const db = require('./db');
const nunjucks = require('nunjucks');
nunjucks.configure({ noCache: true });

app.set('view engine', 'html');
app.engine('html', nunjucks.render);

app.use(require('body-parser').urlencoded());
app.use(require('method-override')('_method'));
app.use('/vendor', express.static(path.join(__dirname, 'node_modules')));

const { Member, Party } = db.models;

// count users and count political parties
app.use((req, res, next) => {
    res.locals.path = req.url
    Member.findAll()
    .then( members => {
        res.locals.membersCount = members.length
    })
    .then (() => {
        Member.count({
            include: ['candidate'],
            distinct: true,
            col: 'candidateId'
        })
    .then (result => {
        res.locals.candidateCount = result
        next()
    })
    })
    .catch(next)
});

// set routes

// home / index
app.get('/', (req, res, next) => {
    res.render('index', {title: 'Home'})
});

// members page
app.get('/members', (req, res, next) => {
    Member.findAll({
        include: [{
            model: Member,
            as: 'candidate'
        }, {
            model: Member,
            as: 'voters'
        }, {
            model: Party
        }]
    })
    .then((members) => res.render('members', { members, title:'Members'}))
    .catch(next)
});

// Create new member
app.post('/members', (req, res, next) => {
    Member.createFromForm(req.body)
    .then( () => res.redirection('/members'))
    .catch(next)
});

// Update member
app.put('/members/:id', (req, res, next) => {
    Member.findById(req.params.id)
    .then( member => {
        Object.assign( member, req.body)
        if( req.body.candidateId === '-1') {
            member.candidateId = null
        }
        return member.save()
    })
    .then( () => res.redirect('/members'))
    .catch(next)
})

// delete
app.delete('/members/:id', (req, res, next) => {
    Member.findById(req.params.id)
    .then(member => member.destroy())
    .then( () => res.redirect('./members'))
    .catch(next)
})

//listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}`));

// sync db and seed
db.sync()
    .then(() => db.seed())
