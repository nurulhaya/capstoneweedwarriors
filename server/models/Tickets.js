export default (database, DataTypes) => {
  const Tickets = database.define(
    "tickets",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      priority: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      created: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      last_modified: {
        type: DataTypes.DATE,
      },
      report_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },

    { freezeTableName: true, timestamps: false }
  );
  return Tickets;
};
