const conn = require('./conn');
const { Sequelize } = conn;

const Party = conn.define('party', {
    name: {
        type: Sequelize.STRING
    }
});

Party.prototype.findMembers = function() {
    return Member.findAll({
        where: {partyId: this.id}
    })
};

module.exports = Party;