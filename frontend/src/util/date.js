'use strict';

const getNowAsLocalDatetime = () => {
    const now = new Date();
    return now.toISOString().slice(0, 19) + 'Z'; // yyyy-MM-ddTHH:mm:ssZ
};

export { getNowAsLocalDatetime }