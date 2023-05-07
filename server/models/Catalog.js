export default (database, DataTypes) => {
  const Catalog = database.define(
    'catalog',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
      usda_symbol: {
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
