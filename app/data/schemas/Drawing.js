module.exports = {
    drawing_id: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
    public_drawing_id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4 },
    // The contents of the drawing.
    contents: { type: Sequelize.STRING },
    // A hash (up to 512 bits) of the contents of the drawing, represented as hexadecimals.
    hash_hex: { type: Sequelize.STRING, unique: true },
    //hash_function: { type: DataTypes.ENUM("sha256") },
    created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
};