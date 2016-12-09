module.exports = function (sequelize, DataTypes) {
	return sequelize.define('asset', {
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [1,15]
			}
		},
		symbol: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [1,10]
			}
		},
		amount: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [1,100],
				isNumeric: true 
			}
		},
		price: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [1,15],
				isNumeric: true 
			}
		},
		description: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [1,100]
			}
		},
		holding: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
			validate: {
			}
		}
	});
};