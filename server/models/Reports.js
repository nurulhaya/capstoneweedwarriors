export default (database, DataTypes) => {
    const Reports = database.define(
      "reports",
      {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        timestamp: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        catalog_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        location: {
          type: DataTypes.STRING, //GEOGRAPHY("POINT"),
          allowNull: false,
        },
        severity_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        media_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        user_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        comments: {
          type: DataTypes.STRING,
          defaultValue: null,
        },
        verified: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false
        },
      },
      {
        freezeTableName: true,
        timestamps: false
      //   timestamps: true,
      //   createdAt: true,
      //   updatedAt: false,
      }
    );
    return Reports;
  };
  