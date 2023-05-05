export default (database, DataTypes) => {
    const Tickets = database.define(
      'tickets',
      {
        ticket_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        ticket_title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        ticket_description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        ticket_priority: {
            type: DataTypes.STRING,
            allowNull: false
        } 
      },

      { freezeTableName: true, timestamps: false }
    );
    return Tickets;
};
  