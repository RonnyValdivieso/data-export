const excel = require('node-excel-export');

// You can define styles as json object
const styles = {
  headerDark: {
    fill: {
      fgColor: {
        rgb: 'FF000000'
      }
    },
    font: {
      color: {
        rgb: 'FFFFFFFF'
      },
      sz: 14,
      bold: true,
      underline: true
    }
  },
  cellPink: {
    fill: {
      fgColor: {
        rgb: 'FFFFCCFF'
      }
    }
  },
  cellGreen: {
    fill: {
      fgColor: {
        rgb: 'FF00FF00'
      }
    }
  }
};

module.exports = {
	getHomePage: (req, res) => {
		let query = "SELECT * FROM `lead_potencial`";

		db.query(query, (err, result) => {
			if (err) {
				throw err;
			}

			let dataset = [
				{customer_name: 'IBM', status_id: 1, note: 'some note', misc: 'not shown'},
			  {customer_name: 'HP', status_id: 0, note: 'some note'},
			  {customer_name: 'MS', status_id: 0, note: 'some note', misc: 'not shown'}
			];

			// res.send({ data: dataset});
			// res.send({ data: result});

			//Here you specify the export structure
			const specification = {
			  customer_name: { // <- the key should match the actual data key
			    displayName: 'Nombre', // <- Here you specify the column header
			    headerStyle: styles.headerDark, // <- Header style
			    cellStyle: function(value, row) { // <- style renderer function
			      // if the status is 1 then color in green else color in red
			      // Notice how we use another cell value to style the current one
			      return (row.status_id == 1) ? styles.cellGreen : {fill: {fgColor: {rgb: 'FFFF0000'}}}; // <- Inline cell style is possible 
			    },
			    width: 120 // <- width in pixels
			  },
			  status_id: {
			    displayName: 'Status',
			    headerStyle: styles.headerDark,
			    cellFormat: function(value, row) { // <- Renderer function, you can access also any row.property
			      return (value == 1) ? 'Active' : 'Inactive';
			    },
			    width: '10' // <- width in chars (when the number is passed as string)
			  },
			  note: {
			    displayName: 'Description',
			    headerStyle: styles.headerDark,
			    cellStyle: styles.cellPink, // <- Cell style
			    width: 220 // <- width in pixels
			  }
			}

			const report = excel.buildExport(
			  [ // <- Notice that this is an array. Pass multiple sheets to create multi sheet report
			    {
			      name: 'Report', // <- Specify sheet name (optional)
			      specification: specification, // <- Report specification
			      data: dataset // <-- Report data
			    }
			  ]
			);

			res.attachment('report.xlsx'); // This is sails.js specific (in general you need to set headers)
			return res.send(report);
		})
	}
}