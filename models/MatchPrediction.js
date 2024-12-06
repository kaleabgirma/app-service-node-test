// models/MatchPrediction.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('MatchPrediction', {
    mid: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    competitionName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    matchDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    homeTeam: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    awayTeam: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    prediction: {
      type: DataTypes.JSONB, // Use JSONB type for PostgreSQL
      allowNull: false,
    },
  }, {
    timestamps: true,
    freezeTableName: true,
  });
};
