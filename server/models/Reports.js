export default (database, DataTypes) => {
    const Reports = database.define(
      "reports",
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          allowNull: false,
          primaryKey: true,
        },
        catalog_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        location: {
          type: DataTypes.GEOMETRY("POINT"),
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
        created: {
            type: DataTypes.DATE,
            allowNull: false
        }
      },
      {
        freezeTableName: true,
        timestamps: false
      }
    );
    return Reports;
  };
  