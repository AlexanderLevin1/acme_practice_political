// this file to sync and seed

// require
const conn = require('./conn');
const Member = require('./member');
const Party = require('./party');

// sync
const sync = () => {
    return conn.sync({ force: true })
};

const seed = () => {
    return Promise.all([
        Party.create({ name: 'Republican'}),
        Party.create({ name: 'Democrat'}),
        Member.create({ email: 'DonaldTrump@twitter.com'}),
        Member.create({ email: 'HillaryClinton@yahoo.com'}),
        Member.create({ email: 'MittRomney@gmail.com'}),
    ])
    .then(([republican, democrat, donald, mitt, hillary]) => {
        return Promise.all([
            donald.setParty(republican),
            mitt.setParty(republican),
            hillary.setParty(democrat),
            donald.setCandidate(donald),
            mitt.setCandidate(donald),
            hillary.setCandidate(hillary)
        ])
    })
};

Member.belongsTo(Party);
Party.hasMany(Member);

module.exports = {
    sync, 
    seed,
    models: {
        Member, 
        Party
    }
}


