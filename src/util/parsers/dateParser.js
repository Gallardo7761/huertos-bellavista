const DateParser = {
    sqlToString: (sqlDate) => {
        let pieces = sqlDate.split('-');
        return pieces[2] + '/' + pieces[1] + '/' + pieces[0];
    },

    timestampToString: (timestamp) => {
        let pieces = timestamp.split('T');
        let date = pieces[0].split('-');
        return date[2] + '/' + date[1] + '/' + date[0];
    }
}

export default DateParser;