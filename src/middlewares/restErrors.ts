const getErrorByStatus = (res: any) => (code: number) => res[code] === false ? false : res[code] ? res[code] : 'unknown error';

const http200 = 200;
const http201 = 201;
const http204 = 204;
const http404 = 404;
const http500 = 500;

const commonErrors = {
    [http200]: false,
    [http404]: `communication error`,
    [http500]: `server issue`,
};
const list = getErrorByStatus({ ...commonErrors });
const read = getErrorByStatus({ ...commonErrors });
const create = getErrorByStatus({ ...commonErrors, [http201]: false, [http204]: false });
const update = getErrorByStatus({ ...commonErrors, [http204]: false });
const remove = getErrorByStatus({ ...commonErrors, [http204]: false, [http404]: false });

export default {
    list,
    read,
    create,
    update,
    remove,
};
