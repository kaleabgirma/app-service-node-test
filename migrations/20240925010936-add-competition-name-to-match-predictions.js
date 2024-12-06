'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add the column allowing NULLs
    await queryInterface.addColumn('MatchPredictions', 'competitionName', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    // Update existing records
    await queryInterface.bulkUpdate('MatchPredictions', 
      { competitionName: 'Unknown Competition' },
      { competitionName: null }
    );

    // Alter the column to NOT NULL
    await queryInterface.changeColumn('MatchPredictions', 'competitionName', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the column
    await queryInterface.removeColumn('MatchPredictions', 'competitionName');
  },
};

