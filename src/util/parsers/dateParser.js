export const DateParser = {
    sqlToString: (sqlDate) => {
        const [datePart] = sqlDate.split('T');
        const [year, month, day] = datePart.split('-');
        return `${day}/${month}/${year}`;
    },

    timestampToString: (timestamp) => {
        const [datePart] = timestamp.split('T');
        const [year, month, day] = datePart.split('-');
        return `${day}/${month}/${year}`;
    },

    isoToStringWithTime: (iso) => {
        if (!iso) return 'NO';
        const [datePart, timePart] = iso.split('T');
        if (!datePart || !timePart) return 'NO';
        const [year, month, day] = datePart.split('-');
        const [hour, minute] = timePart.split(':');
        return `${day}/${month}/${year} a las ${hour}:${minute}`;
    }
};
