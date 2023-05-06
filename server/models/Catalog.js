export default (database, DataTypes) => {
  const Catalog = database.define(
    'catalog',
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      symbol: {
        type: DataTypes.STRING,
        allowNull: false
      },
      latin_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      common_name: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    { freezeTableName: true, timestamps: false }
  );
  return Catalog;
};
