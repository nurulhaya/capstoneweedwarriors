export default (database, DataTypes) => {
    const Tickets = database.define(
      'tickets',
      {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        priority: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false
        },
       /* created: {
            type: DataTypes.DATE,
            allowNull: false
        },*/
        location: {
            type: DataTypes.GEOMETRY('POINT'),
            allowNull: false
        }

      },

      { freezeTableName: true, timestamps:true}
    );
    return Tickets;
};
  