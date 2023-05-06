export default (database, DataTypes) => {
    const Severity = database.define(
        'severity',
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            category: {
                type: DataTypes.STRING,
                allowNull: false
            }
        },
        { freezeTableName: true, timestamps: false }
    );
    return Severity;
};