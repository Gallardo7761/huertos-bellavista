const DateParser = {
    sqlToString: (sqlDate) => {
        let pieces = sqlDate.split('-');
        return pieces[2] + '/' + pieces[1] + '/' + pieces[0];
    }
}

export default DateParser;