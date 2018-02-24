const conn = require('./conn');
const { Sequelize } = conn;

const Member = conn.define('member', {
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        }
    }
}, {
    getterMethods: {
        name: function () {
            return this.email.split('@')[0]
        },
        emailProvider: function () {
            return this.email.split('@')[1]
        }
    }
});

Member.prototype.findVoters = function() {
    return Member.findAll({
        where: {candidateId: this.id}
    })
};

Member.createFromForm = function(body) {
    if (body.candidateId === '-1') delete body.candidateId;
    return this.create(body)
};

Member.belongsTo(Member, { as: 'candidate'});
Member.hasMany(Member, { as: 'voters', foreignKey: 'candidateId'})

module.exports = Member;