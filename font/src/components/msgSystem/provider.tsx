import { useEffect, useState, Fragment } from 'react';
import { DataTable } from 'mantine-datatable';
import { Dialog, Transition } from '@headlessui/react';
import axios from 'axios';
import AlertComponent from '../Alert/AlertComponent';

export default function MsgProvider() {
    const endpoint = import.meta.env.VITE_API_ENDPOINT;
    const collectionName = 'Provider';

    // Provider zone
    const [rowData, setRowData] = useState([] as any);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [initialRecords, setInitialRecords] = useState(rowData);
    const [recordsData, setRecordsData] = useState(initialRecords.reverse());
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('');
    const [modalEdit, setModalEdit] = useState(false);
    const [modalAdd, setModalAdd] = useState(false);
    const [modalDelete, setModalDelete] = useState(false);
    const [passwordShown, setPasswordShown] = useState(false);
    const [statusToggleProvider, setStatusToggleProvider] = useState(true);
    const [idForDeleteProvider, setIdForDeleteProvider] = useState('' as any);
    const [dataForEditProvider, setDataForEditProvider] = useState({
        id: '',
        name: '',
        desc: '',
        credential: {
            username: '',
            password: '',
        },
        status: '',
    } as any);
    const [dataForAddProvider, setDataForAddProvider] = useState({
        name: '',
        desc: '',
        credential: {
            username: '',
            password: '',
        },
        status: 'inactive',
    } as any);

    useEffect(() => {
        console.log(rowData)
        async function fetchItemsOne() {
            try {
                console.log('fetching data api');
                const response = await axios.get(`${endpoint}/providers`);
                setRowData(response.data.result);
            } catch (error) {
                console.error('Error fetching data: ', error);
            }
        }
        if (rowData.length == 0) {
            fetchItemsOne();
            console.log('fetching data');
        } else {
            console.log('no data');
        }
    }, []);

    async function fetchItems() {
        try {
            const response = await axios.get(`${endpoint}/providers`);
            setRowData(response.data.result);
        } catch (error) {
            console.error('Error fetching data: ', error);
        }
    }

    const openDeleteButton = (id: any) => {
        setModalDelete(true);
        setIdForDeleteProvider(id);
    };

    const handleChangeProvider = (event: any) => {
        const { name, value } = event.target;
        if (name.includes('credential')) {
            const [key, subKey] = name.split(':');
            setDataForEditProvider((dataForEditProvider: any) => ({
                ...dataForEditProvider,
                [key]: {
                    ...dataForEditProvider[key],
                    [subKey]: value,
                },
            }));
            return;
        } else {
            setDataForEditProvider((dataForEditProvider: any) => ({
                ...dataForEditProvider,
                [name]: value,
            }));
        }
    };

    const handleChangeAddProvider = (event: any) => {
        const { name, value } = event.target;
        if (name.includes('credential')) {
            const [key, subKey] = name.split(':');
            setDataForAddProvider((dataForAddProvider: any) => ({
                ...dataForAddProvider,
                [key]: {
                    ...dataForAddProvider[key],
                    [subKey]: value,
                },
            }));
            return;
        } else {
            setDataForAddProvider((dataForAddProvider: any) => ({
                ...dataForAddProvider,
                [name]: value,
            }));
        }
    };

    const openEditModal = (data: any) => {
        data.status === 'active' ? setStatusToggleProvider(true) : setStatusToggleProvider(false);
        setDataForEditProvider(data);
        setModalEdit(true);
    };

    const togglePasswordVisibility = () => {
        setPasswordShown(!passwordShown);
    };
    useEffect(() => {
        setPage(1);
    }, [pageSize]);
    useEffect(() => {
        const from = (page - 1) * pageSize;
        const to = from + pageSize;
        setRecordsData([...initialRecords.slice(from, to)]);
    }, [page, pageSize, initialRecords]);
    useEffect(() => {
        if (rowData !== undefined) {
            setInitialRecords(() => {
                return rowData.filter((item: any) => {
                    return item._id.toString().includes(search.toLowerCase()) || item.name.toLowerCase().includes(search.toLowerCase()) || item.status.toLowerCase().includes(search.toLowerCase());
                });
            });
        } else {
        }
    }, [search, rowData]);
    useEffect(() => {
        if (rowData !== undefined) {
            setInitialRecords(() => {
                return rowData.filter((item: any) => {
                    const searchfilter = filter === 'active' ? 'active' : filter === 'inactive' ? 'inactive' : '';
                    if (searchfilter === 'active') {
                        return (
                            (item._id.toString().includes(search.toLowerCase()) ||
                                item.name.toLowerCase().includes(search.toLowerCase()) ||
                                item.status.toLowerCase().includes(search.toLowerCase())) &&
                            item.status === 'active'
                        );
                    } else if (searchfilter === 'inactive') {
                        return (
                            (item._id.toString().includes(search.toLowerCase()) ||
                                item.name.toLowerCase().includes(search.toLowerCase()) ||
                                item.status.toLowerCase().includes(search.toLowerCase())) &&
                            item.status === 'inactive'
                        );
                    } else {
                        return item._id.toString().includes(search.toLowerCase()) || item.name.toLowerCase().includes(search.toLowerCase()) || item.status.toLowerCase().includes(search.toLowerCase());
                    }
                });
            });
        } else {
        }
    }, [filter, rowData]);

    return (
        <>
            <div className="active pt-5">
                <div className="grid xl:grid-cols-3 gap-6 mb-6">
                    <div className="panel h-full xl:col-span-3">
                        <div className="flex items-center justify-end mb-5">
                            <h5 className="mr-3 font-semibold text-lg dark:text-white-light">
                                <button
                                    onClick={() => {
                                        setModalAdd(true);
                                        setDataForAddProvider({
                                            name: '',
                                            desc: '',
                                            credential: {
                                                username: '',
                                                password: '',
                                            },
                                            status: 'active',
                                        });
                                        setStatusToggleProvider(true);
                                    }}
                                    type="button"
                                    className="btn btn-primary"
                                >
                                    + Add new
                                </button>
                            </h5>
                            <div className=" mr-3">
                                <div className="relative">
                                    <div className="absolute inset-y-0 right-1 pl-5 pr-1 flex items-center pointer-events-none">
                                        <svg width="11" height="4" viewBox="0 0 11 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path opacity="0.8" d="M1 1L5.44643 3L9.89286 1" stroke="black" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
                                    </div>
                                    <select id="filter" name="filter" value={filter} onChange={(e) => setFilter(e.target.value)} className="form-input w-auto pr-5">
                                        <option selected>All status</option>
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 right-1 pl-3 flex items-center pointer-events-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                    </svg>
                                </div>
                                <input className="form-input w-auto pr-4" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
                            </div>
                        </div>

                        <div className="datatables">
                            {recordsData.length <= 0 ? (
                                <DataTable
                                    striped
                                    className="whitespace-nowrap table-striped"
                                    records={recordsData}
                                    columns={[
                                        { accessor: 'name', title: 'Provider' },
                                        { accessor: 'desc', title: 'Description' },
                                        {
                                            accessor: 'status',
                                            title: 'status',
                                            width: '200px',
                                            render: ({ status }: any) => {
                                                if (status === 'active') {
                                                    return <span className="badge badge-outline-success">Active</span>;
                                                } else if (status === 'inactive') {
                                                    return <span className="badge badge-outline-danger">Inactive</span>;
                                                } else if (status === 'pending') {
                                                    return <span className="badge badge-outline-wanning">Pending</span>;
                                                } else {
                                                    return <span className="badge badge-outline-dark">Unknown</span>;
                                                }
                                            },
                                        },
                                        {
                                            accessor: 'actions',
                                            title: '',
                                            width: '200px',
                                            textAlignment: 'center',
                                            render: (item) => {
                                                return (
                                                    <>
                                                        <div className="flex justify-around">
                                                            <button type="button" onClick={() => openEditModal(item)} className="btn btn-warning py-3">
                                                                <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path
                                                                        d="M6.79061 2.54174H2.59307C2.14777 2.54174 1.72071 2.691 1.40583 2.95667C1.09096 3.22235 0.914063 3.58268 0.914062 3.95841V11.7501C0.914063 12.1258 1.09096 12.4861 1.40583 12.7518C1.72071 13.0175 2.14777 13.1667 2.59307 13.1667H11.8276C12.2729 13.1667 12.7 13.0175 13.0149 12.7518C13.3298 12.4861 13.5067 12.1258 13.5067 11.7501V8.20841M12.3196 1.54016C12.4745 1.40485 12.6597 1.29693 12.8646 1.22268C13.0694 1.14843 13.2898 1.10935 13.5127 1.10772C13.7356 1.10608 13.9567 1.14193 14.1631 1.21316C14.3694 1.28439 14.5569 1.38958 14.7145 1.5226C14.8722 1.65561 14.9968 1.81379 15.0813 1.98789C15.1657 2.16199 15.2082 2.34854 15.2062 2.53664C15.2043 2.72475 15.158 2.91064 15.07 3.08348C14.982 3.25632 14.8541 3.41264 14.6937 3.54332L7.48572 9.62507H5.11159V7.62191L12.3196 1.54016Z"
                                                                        stroke="white"
                                                                        stroke-linecap="square"
                                                                        stroke-linejoin="round"
                                                                    />
                                                                </svg>
                                                            </button>
                                                            <button type="button" onClick={() => openDeleteButton(item._id)} className="btn btn-danger py-3">
                                                                <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path
                                                                        d="M5.5 7.25V11.75M8.5 7.25V11.75M1 4.25H13M12.25 4.25L11.5997 13.3565C11.5728 13.7349 11.4035 14.0891 11.1258 14.3477C10.8482 14.6063 10.4829 14.75 10.1035 14.75H3.8965C3.5171 14.75 3.1518 14.6063 2.87416 14.3477C2.59653 14.0891 2.42719 13.7349 2.40025 13.3565L1.75 4.25H12.25ZM9.25 4.25V2C9.25 1.80109 9.17098 1.61032 9.03033 1.46967C8.88968 1.32902 8.69891 1.25 8.5 1.25H5.5C5.30109 1.25 5.11032 1.32902 4.96967 1.46967C4.82902 1.61032 4.75 1.80109 4.75 2V4.25H9.25Z"
                                                                        stroke="white"
                                                                        stroke-linecap="square"
                                                                        stroke-linejoin="round"
                                                                    />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </>
                                                );
                                            },
                                        },
                                    ]}
                                    minHeight={200}
                                />
                            ) : (
                                <DataTable
                                    striped
                                    className="whitespace-nowrap table-striped"
                                    records={recordsData}
                                    columns={[
                                        { accessor: 'name', title: 'Provider' },
                                        { accessor: 'desc', title: 'Description' },
                                        {
                                            accessor: 'status',
                                            title: 'status',
                                            width: '200px',
                                            render: ({ status }: any) => {
                                                if (status === 'active') {
                                                    return <span className="badge badge-outline-success">Active</span>;
                                                } else if (status === 'inactive') {
                                                    return <span className="badge badge-outline-danger">Inactive</span>;
                                                } else if (status === 'pending') {
                                                    return <span className="badge badge-outline-wanning">Pending</span>;
                                                } else {
                                                    return <span className="badge badge-outline-dark">Unknown</span>;
                                                }
                                            },
                                        },
                                        {
                                            accessor: 'actions',
                                            title: '',
                                            width: '200px',
                                            textAlignment: 'center',
                                            render: (item) => {
                                                return (
                                                    <>
                                                        <div className="flex justify-around">
                                                            <button type="button" onClick={() => openEditModal(item)} className="btn btn-warning py-3">
                                                                <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path
                                                                        d="M6.79061 2.54174H2.59307C2.14777 2.54174 1.72071 2.691 1.40583 2.95667C1.09096 3.22235 0.914063 3.58268 0.914062 3.95841V11.7501C0.914063 12.1258 1.09096 12.4861 1.40583 12.7518C1.72071 13.0175 2.14777 13.1667 2.59307 13.1667H11.8276C12.2729 13.1667 12.7 13.0175 13.0149 12.7518C13.3298 12.4861 13.5067 12.1258 13.5067 11.7501V8.20841M12.3196 1.54016C12.4745 1.40485 12.6597 1.29693 12.8646 1.22268C13.0694 1.14843 13.2898 1.10935 13.5127 1.10772C13.7356 1.10608 13.9567 1.14193 14.1631 1.21316C14.3694 1.28439 14.5569 1.38958 14.7145 1.5226C14.8722 1.65561 14.9968 1.81379 15.0813 1.98789C15.1657 2.16199 15.2082 2.34854 15.2062 2.53664C15.2043 2.72475 15.158 2.91064 15.07 3.08348C14.982 3.25632 14.8541 3.41264 14.6937 3.54332L7.48572 9.62507H5.11159V7.62191L12.3196 1.54016Z"
                                                                        stroke="white"
                                                                        stroke-linecap="square"
                                                                        stroke-linejoin="round"
                                                                    />
                                                                </svg>
                                                            </button>
                                                            <button type="button" onClick={() => openDeleteButton(item._id)} className="btn btn-danger py-3">
                                                                <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path
                                                                        d="M5.5 7.25V11.75M8.5 7.25V11.75M1 4.25H13M12.25 4.25L11.5997 13.3565C11.5728 13.7349 11.4035 14.0891 11.1258 14.3477C10.8482 14.6063 10.4829 14.75 10.1035 14.75H3.8965C3.5171 14.75 3.1518 14.6063 2.87416 14.3477C2.59653 14.0891 2.42719 13.7349 2.40025 13.3565L1.75 4.25H12.25ZM9.25 4.25V2C9.25 1.80109 9.17098 1.61032 9.03033 1.46967C8.88968 1.32902 8.69891 1.25 8.5 1.25H5.5C5.30109 1.25 5.11032 1.32902 4.96967 1.46967C4.82902 1.61032 4.75 1.80109 4.75 2V4.25H9.25Z"
                                                                        stroke="white"
                                                                        stroke-linecap="square"
                                                                        stroke-linejoin="round"
                                                                    />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </>
                                                );
                                            },
                                        },
                                    ]}
                                    totalRecords={initialRecords.length}
                                    recordsPerPage={pageSize}
                                    page={page}
                                    // noRecordsText=""
                                    onPageChange={(p) => setPage(p)}
                                    // recordsPerPageOptions={setPageSize}
                                    // onRecordsPerPageChange={setPageSize}
                                    minHeight={200}
                                    paginationText={({ from, to, totalRecords }) => ``}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* modal zone */}

            {/* edit */}
            <Transition appear show={modalEdit} as={Fragment}>
                <Dialog as="div" open={modalEdit} onClose={() => setModalEdit(false)}>
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0" />
                    </Transition.Child>
                    <div className="fixed inset-0 bg-[black]/60 z-[999] overflow-y-auto">
                        <div className="flex items-center justify-center min-h-screen px-4">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel as="div" className="panel border-0 p-0 rounded-lg overflow-hidden my-8 w-full max-w-xl text-black dark:text-white-dark">
                                    <div className="flex bg-[#fbfbfb] dark:bg-[#121c2c] items-center justify-between px-5 py-3 rounded-lg">
                                        <div className="text-lg font-bold">Edit Provider</div>
                                    </div>

                                    <div className="p-5">
                                        <form>
                                            <div className="flex items-center justify-end my-4 mr-5">
                                                <label htmlFor="">Provider</label>
                                                <input
                                                    name="name"
                                                    type="text"
                                                    placeholder=""
                                                    value={dataForEditProvider.name}
                                                    onChange={handleChangeProvider}
                                                    className="w-96 ml-5 form-input text-base"
                                                    required
                                                />
                                            </div>
                                            <div className="flex items-start justify-end my-4 mr-5">
                                                <label htmlFor="">Description</label>
                                                <textarea
                                                    value={dataForEditProvider.desc}
                                                    onChange={handleChangeProvider}
                                                    name="desc"
                                                    placeholder=""
                                                    className="w-96 ml-5 form-input text-base"
                                                    required
                                                />
                                            </div>

                                            <div className="relative border-2 p-5 mt-5 form-input">
                                                <div className="absolute top-[-10px] left-2 bg-white px-1">Credential</div>
                                                <div className="flex items-center justify-end my-4">
                                                    <label htmlFor="">Username</label>
                                                    <input
                                                        name="credential:username"
                                                        value={dataForEditProvider.credential.username}
                                                        onChange={handleChangeProvider}
                                                        type="text"
                                                        placeholder=""
                                                        className="w-96 ml-5 form-input text-base"
                                                        required
                                                    />
                                                </div>

                                                <div className="flex items-start justify-end my-4">
                                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                                        Password
                                                    </label>
                                                    <div className="mt-1 relative rounded-md shadow-sm">
                                                        <input
                                                            name="credential:password"
                                                            value={dataForEditProvider.credential.password}
                                                            onChange={handleChangeProvider}
                                                            type={passwordShown ? 'text' : 'password'}
                                                            required
                                                            className="w-96 ml-5 form-input text-base"
                                                        />
                                                        <button type="button" onClick={togglePasswordVisibility} className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                                                            {passwordShown ? (
                                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path
                                                                        fill-rule="evenodd"
                                                                        clip-rule="evenodd"
                                                                        d="M15.9202 12.7988C15.9725 12.5407 16 12.2736 16 12C16 9.79086 14.2091 8 12 8C11.7264 8 11.4593 8.02746 11.2012 8.07977L15.9202 12.7988ZM8.66676 9.78799C8.24547 10.4216 8 11.1821 8 12C8 14.2091 9.79086 16 12 16C12.8179 16 13.5784 15.7545 14.212 15.3332L12.7381 13.8594C12.5098 13.9501 12.2607 14 12 14C10.8954 14 10 13.1046 10 12C10 11.7393 10.0499 11.4902 10.1406 11.2619L8.66676 9.78799Z"
                                                                        fill="#FF0000"
                                                                    />
                                                                    <path
                                                                        fill-rule="evenodd"
                                                                        clip-rule="evenodd"
                                                                        d="M16.5189 17.6405L15.0496 16.1712C14.0774 16.6805 13.0475 17 11.9998 17C10.474 17 8.98592 16.3224 7.6589 15.3677C6.33978 14.4186 5.26384 13.2558 4.58362 12.43C4.48385 12.3088 4.40934 12.2182 4.34761 12.1385C4.29874 12.0754 4.26762 12.0315 4.24731 12C4.26762 11.9685 4.29874 11.9246 4.34761 11.8615C4.40934 11.7818 4.48385 11.6912 4.58362 11.57C5.24903 10.7622 6.2931 9.63187 7.57307 8.69463L6.14434 7.2659C4.79618 8.29616 3.72222 9.47005 3.03985 10.2985C3.01626 10.3272 2.99168 10.3566 2.96638 10.3869L2.96636 10.3869C2.65294 10.7624 2.22949 11.2696 2.22949 12C2.22949 12.7304 2.65294 13.2376 2.96636 13.6131L2.96658 13.6133C2.99181 13.6435 3.01633 13.6729 3.03985 13.7015C3.77972 14.5998 4.97993 15.9041 6.49087 16.9912C7.99391 18.0725 9.88983 19 11.9998 19C13.6698 19 15.2057 18.419 16.5189 17.6405ZM8.80658 5.6855C9.79037 5.26871 10.8641 5 11.9998 5C14.1097 5 16.0056 5.92747 17.5087 7.00885C19.0196 8.0959 20.2198 9.40025 20.9597 10.2985C20.9833 10.3272 21.0078 10.3566 21.0331 10.3869L21.0332 10.3869C21.3466 10.7624 21.77 11.2696 21.77 12C21.77 12.7304 21.3466 13.2376 21.0332 13.6131C21.0079 13.6434 20.9833 13.6728 20.9597 13.7015C20.473 14.2923 19.7872 15.0589 18.9448 15.8237L17.5287 14.4077C18.3086 13.708 18.9536 12.9912 19.4159 12.43C19.5157 12.3088 19.5902 12.2182 19.6519 12.1385C19.7008 12.0754 19.7319 12.0315 19.7522 12C19.7319 11.9685 19.7008 11.9246 19.6519 11.8615C19.5902 11.7818 19.5157 11.6912 19.4159 11.57C18.7357 10.7442 17.6598 9.58138 16.3406 8.63233C15.0136 7.6776 13.5256 7 11.9998 7C11.4488 7 10.9027 7.08837 10.3673 7.24624L8.80658 5.6855Z"
                                                                        fill="#FF0000"
                                                                    />
                                                                    <path d="M5 2L21 18" stroke="#FF0000" stroke-width="2" />
                                                                </svg>
                                                            ) : (
                                                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path
                                                                        d="M11.7678 11.7678C12.2366 11.2989 12.5 10.663 12.5 10C12.5 9.33696 12.2366 8.70107 11.7678 8.23223C11.2989 7.76339 10.663 7.5 10 7.5C9.33696 7.5 8.70107 7.76339 8.23223 8.23223C7.76339 8.70107 7.5 9.33696 7.5 10C7.5 10.663 7.76339 11.2989 8.23223 11.7678C8.70107 12.2366 9.33696 12.5 10 12.5C10.663 12.5 11.2989 12.2366 11.7678 11.7678Z"
                                                                        stroke="#848080"
                                                                        stroke-width="2"
                                                                        stroke-linecap="round"
                                                                        stroke-linejoin="round"
                                                                    />
                                                                    <path
                                                                        d="M2.04785 10.0001C3.10952 6.61925 6.26868 4.16675 9.99952 4.16675C13.7312 4.16675 16.8895 6.61925 17.9512 10.0001C16.8895 13.3809 13.7312 15.8334 9.99952 15.8334C6.26868 15.8334 3.10952 13.3809 2.04785 10.0001Z"
                                                                        stroke="#848080"
                                                                        stroke-width="2"
                                                                        stroke-linecap="round"
                                                                        stroke-linejoin="round"
                                                                    />
                                                                </svg>
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-start justify-end my-4 mr-5">
                                                <label htmlFor="">Status</label>
                                                <div className="w-96 ml-5 flex items-center">
                                                    <label className="w-12 h-6 relative">
                                                        <input
                                                            type="checkbox"
                                                            className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer"
                                                            id="custom_switch_checkbox1"
                                                            checked={statusToggleProvider}
                                                            onChange={() => {
                                                                setStatusToggleProvider(!statusToggleProvider);
                                                                setDataForEditProvider((dataForEditProvider: any) => ({
                                                                    ...dataForEditProvider,
                                                                    status: !statusToggleProvider ? 'active' : 'inactive',
                                                                }));
                                                            }}
                                                        />
                                                        <span className="outline_checkbox bg-icon border-2 border-[#ebedf2] dark:border-white-dark block h-full rounded-full before:absolute before:left-1 before:bg-[#ebedf2] dark:before:bg-white-dark before:bottom-1 before:w-4 before:h-4 before:rounded-full before:bg-[url(/assets/images/close.svg)] before:bg-no-repeat before:bg-center peer-checked:before:left-7 peer-checked:before:bg-[url(/assets/images/checked.svg)] peer-checked:border-success peer-checked:before:bg-success before:transition-all before:duration-300"></span>
                                                    </label>
                                                    {statusToggleProvider ? <span className="text-sm text-success px-5">Active</span> : <span className="text-sm text-danger px-5">Inactive</span>}{' '}
                                                </div>
                                            </div>
                                        </form>

                                        <div className="flex justify-end items-center mt-8">
                                            <button type="button" className="btn bg-[#848080] text-white" onClick={() => setModalEdit(false)}>
                                                Cancel
                                            </button>
                                            {/* <button type="button" className="btn btn-info ltr:ml-4 rtl:mr-4" onClick={() => updateProvider()}>
                                                Save
                                            </button> */}
                                            <AlertComponent
                                                actions={'update'}
                                                collectionName={collectionName}
                                                body={dataForEditProvider}
                                                url={`${endpoint}/provider?id=${dataForEditProvider._id}`}
                                                setModal={setModalEdit}
                                                fetchItems={fetchItems}
                                                btnClassName={'btn btn-info ltr:ml-4 rtl:mr-4'}
                                                buttonText={'Save'}
                                            />
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            {/* add */}
            <Transition appear show={modalAdd} as={Fragment}>
                <Dialog as="div" open={modalAdd} onClose={() => setModalAdd(false)}>
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0" />
                    </Transition.Child>
                    <div className="fixed inset-0 bg-[black]/60 z-[999] overflow-y-auto">
                        <div className="flex items-center justify-center min-h-screen px-4">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel as="div" className="panel border-0 p-0 rounded-lg overflow-hidden my-8 w-full max-w-xl text-black dark:text-white-dark">
                                    <div className="flex bg-[#fbfbfb] dark:bg-[#121c2c] items-center justify-between px-5 py-3">
                                        <div className="text-lg font-bold">Add Provider</div>
                                    </div>

                                    <div className="p-5">
                                        <form>
                                            <div className="flex items-center justify-end my-4 mr-5">
                                                <label htmlFor="">Provider</label>
                                                <input
                                                    name="name"
                                                    onChange={handleChangeAddProvider}
                                                    value={dataForAddProvider.name}
                                                    type="text"
                                                    placeholder=""
                                                    className="w-96 ml-5 form-input text-base"
                                                    required
                                                />
                                            </div>
                                            <div className="flex items-start justify-end my-4 mr-5">
                                                <label htmlFor="">Description</label>
                                                <textarea
                                                    name="desc"
                                                    onChange={handleChangeAddProvider}
                                                    value={dataForAddProvider.desc}
                                                    placeholder=""
                                                    className="w-96 ml-5 form-input text-base"
                                                    required
                                                />
                                            </div>

                                            <div className="relative border-2 p-5 mt-5 form-input">
                                                <div className="absolute top-[-10px] left-2 bg-white px-1">Credential</div>
                                                <div className="flex items-center justify-end my-4">
                                                    <label className="text-base text-gray-700" htmlFor="">
                                                        Username
                                                    </label>
                                                    <input
                                                        name="credential:username"
                                                        onChange={handleChangeAddProvider}
                                                        value={dataForAddProvider.credential.username}
                                                        type="text"
                                                        placeholder=""
                                                        className="w-96 ml-5 form-input text-base"
                                                        required
                                                    />
                                                </div>

                                                <div className="flex items-center justify-end my-4">
                                                    <label htmlFor="password" className="text-base text-gray-700">
                                                        Password
                                                    </label>
                                                    <div className="mt-1 relative rounded-md shadow-sm">
                                                        <input
                                                            name="credential:password"
                                                            onChange={handleChangeAddProvider}
                                                            value={dataForAddProvider.credential.password}
                                                            type={passwordShown ? 'text' : 'password'}
                                                            required
                                                            className="w-96 ml-5 form-input text-base"
                                                        />
                                                        <button type="button" onClick={togglePasswordVisibility} className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                                                            {passwordShown ? (
                                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path
                                                                        fill-rule="evenodd"
                                                                        clip-rule="evenodd"
                                                                        d="M15.9202 12.7988C15.9725 12.5407 16 12.2736 16 12C16 9.79086 14.2091 8 12 8C11.7264 8 11.4593 8.02746 11.2012 8.07977L15.9202 12.7988ZM8.66676 9.78799C8.24547 10.4216 8 11.1821 8 12C8 14.2091 9.79086 16 12 16C12.8179 16 13.5784 15.7545 14.212 15.3332L12.7381 13.8594C12.5098 13.9501 12.2607 14 12 14C10.8954 14 10 13.1046 10 12C10 11.7393 10.0499 11.4902 10.1406 11.2619L8.66676 9.78799Z"
                                                                        fill="#FF0000"
                                                                    />
                                                                    <path
                                                                        fill-rule="evenodd"
                                                                        clip-rule="evenodd"
                                                                        d="M16.5189 17.6405L15.0496 16.1712C14.0774 16.6805 13.0475 17 11.9998 17C10.474 17 8.98592 16.3224 7.6589 15.3677C6.33978 14.4186 5.26384 13.2558 4.58362 12.43C4.48385 12.3088 4.40934 12.2182 4.34761 12.1385C4.29874 12.0754 4.26762 12.0315 4.24731 12C4.26762 11.9685 4.29874 11.9246 4.34761 11.8615C4.40934 11.7818 4.48385 11.6912 4.58362 11.57C5.24903 10.7622 6.2931 9.63187 7.57307 8.69463L6.14434 7.2659C4.79618 8.29616 3.72222 9.47005 3.03985 10.2985C3.01626 10.3272 2.99168 10.3566 2.96638 10.3869L2.96636 10.3869C2.65294 10.7624 2.22949 11.2696 2.22949 12C2.22949 12.7304 2.65294 13.2376 2.96636 13.6131L2.96658 13.6133C2.99181 13.6435 3.01633 13.6729 3.03985 13.7015C3.77972 14.5998 4.97993 15.9041 6.49087 16.9912C7.99391 18.0725 9.88983 19 11.9998 19C13.6698 19 15.2057 18.419 16.5189 17.6405ZM8.80658 5.6855C9.79037 5.26871 10.8641 5 11.9998 5C14.1097 5 16.0056 5.92747 17.5087 7.00885C19.0196 8.0959 20.2198 9.40025 20.9597 10.2985C20.9833 10.3272 21.0078 10.3566 21.0331 10.3869L21.0332 10.3869C21.3466 10.7624 21.77 11.2696 21.77 12C21.77 12.7304 21.3466 13.2376 21.0332 13.6131C21.0079 13.6434 20.9833 13.6728 20.9597 13.7015C20.473 14.2923 19.7872 15.0589 18.9448 15.8237L17.5287 14.4077C18.3086 13.708 18.9536 12.9912 19.4159 12.43C19.5157 12.3088 19.5902 12.2182 19.6519 12.1385C19.7008 12.0754 19.7319 12.0315 19.7522 12C19.7319 11.9685 19.7008 11.9246 19.6519 11.8615C19.5902 11.7818 19.5157 11.6912 19.4159 11.57C18.7357 10.7442 17.6598 9.58138 16.3406 8.63233C15.0136 7.6776 13.5256 7 11.9998 7C11.4488 7 10.9027 7.08837 10.3673 7.24624L8.80658 5.6855Z"
                                                                        fill="#FF0000"
                                                                    />
                                                                    <path d="M5 2L21 18" stroke="#FF0000" stroke-width="2" />
                                                                </svg>
                                                            ) : (
                                                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path
                                                                        d="M11.7678 11.7678C12.2366 11.2989 12.5 10.663 12.5 10C12.5 9.33696 12.2366 8.70107 11.7678 8.23223C11.2989 7.76339 10.663 7.5 10 7.5C9.33696 7.5 8.70107 7.76339 8.23223 8.23223C7.76339 8.70107 7.5 9.33696 7.5 10C7.5 10.663 7.76339 11.2989 8.23223 11.7678C8.70107 12.2366 9.33696 12.5 10 12.5C10.663 12.5 11.2989 12.2366 11.7678 11.7678Z"
                                                                        stroke="#848080"
                                                                        stroke-width="2"
                                                                        stroke-linecap="round"
                                                                        stroke-linejoin="round"
                                                                    />
                                                                    <path
                                                                        d="M2.04785 10.0001C3.10952 6.61925 6.26868 4.16675 9.99952 4.16675C13.7312 4.16675 16.8895 6.61925 17.9512 10.0001C16.8895 13.3809 13.7312 15.8334 9.99952 15.8334C6.26868 15.8334 3.10952 13.3809 2.04785 10.0001Z"
                                                                        stroke="#848080"
                                                                        stroke-width="2"
                                                                        stroke-linecap="round"
                                                                        stroke-linejoin="round"
                                                                    />
                                                                </svg>
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-start justify-end my-4 mr-5">
                                                <label htmlFor="">Status</label>
                                                <div className="w-96 ml-5 flex items-center">
                                                    <label className="w-12 h-6 relative">
                                                        <input
                                                            name="status"
                                                            type="checkbox"
                                                            className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer"
                                                            id="custom_switch_checkbox1"
                                                            checked={statusToggleProvider}
                                                            onClick={() => {
                                                                setStatusToggleProvider(!statusToggleProvider);
                                                                setDataForAddProvider({ ...dataForAddProvider, status: !statusToggleProvider ? 'active' : 'inactive' });
                                                            }}
                                                        />
                                                        <span className="outline_checkbox bg-icon border-2 border-[#ebedf2] dark:border-white-dark block h-full rounded-full before:absolute before:left-1 before:bg-[#ebedf2] dark:before:bg-white-dark before:bottom-1 before:w-4 before:h-4 before:rounded-full before:bg-[url(/assets/images/close.svg)] before:bg-no-repeat before:bg-center peer-checked:before:left-7 peer-checked:before:bg-[url(/assets/images/checked.svg)] peer-checked:border-success peer-checked:before:bg-success before:transition-all before:duration-300"></span>
                                                    </label>
                                                    {statusToggleProvider ? <span className="text-sm text-success px-5">Active</span> : <span className="text-sm text-danger px-5">Inactive</span>}
                                                </div>
                                            </div>
                                        </form>

                                        <div className="flex justify-end items-center mt-8">
                                            <button type="button" className="btn bg-[#848080] text-white" onClick={() => setModalAdd(false)}>
                                                Cancel
                                            </button>
                                            {/* <button type="button" className="btn btn-info ltr:ml-4 rtl:mr-4" onClick={() => createProvider()}>
                                                Save
                                            </button> */}
                                            <AlertComponent
                                                actions={'create'}
                                                collectionName={collectionName}
                                                url={`${endpoint}/provider`}
                                                body={dataForAddProvider}
                                                fetchItems={fetchItems}
                                                setModal={setModalAdd}
                                                btnClassName="btn btn-info ltr:ml-4 rtl:mr-4"
                                                buttonText={'Save'}
                                            />
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            {/* delete */}
            <Transition appear show={modalDelete} as={Fragment}>
                <Dialog as="div" open={modalDelete} onClose={() => setModalDelete(false)}>
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0" />
                    </Transition.Child>
                    <div className="fixed inset-0 bg-[black]/60 z-[999] overflow-y-auto">
                        <div className="flex items-center justify-center min-h-screen px-4">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel as="div" className="panel border-0 p-0 rounded-lg overflow-hidden my-8 w-full max-w-md text-black dark:text-white-dark">
                                    <div className="flex bg-[#fbfbfb] dark:bg-[#121c2c] items-center justify-between px-5">
                                        <div className="text-lg font-bold"></div>
                                    </div>
                                    <div className="p-5 flex flex-col justify-center items-center">
                                        <svg width="30" height="34" viewBox="0 0 40 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M15.333 19.6667V33.6667M24.6663 19.6667V33.6667M1.33301 10.3333H38.6663M36.333 10.3333L34.31 38.6647C34.2262 39.842 33.6994 40.9439 32.8356 41.7483C31.9718 42.5528 30.8353 43 29.655 43H10.3443C9.164 43 8.0275 42.5528 7.16374 41.7483C6.29998 40.9439 5.77315 39.842 5.68934 38.6647L3.66634 10.3333H36.333ZM26.9997 10.3333V3.33333C26.9997 2.71449 26.7538 2.121 26.3163 1.68342C25.8787 1.24583 25.2852 1 24.6663 1H15.333C14.7142 1 14.1207 1.24583 13.6831 1.68342C13.2455 2.121 12.9997 2.71449 12.9997 3.33333V10.3333H26.9997Z"
                                                stroke="black"
                                                stroke-width="2"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                            />
                                        </svg>

                                        <span className="font-bold mt-5">Are you sure ?</span>
                                        <span className="mb-3">This operation cannot be undone.</span>
                                        <div className="flex flex-row mt-5">
                                            <button onClick={() => setModalDelete(false)} type="button" className="btn btn-outline-dark mx-2">
                                                No, cancel
                                            </button>
                                            <AlertComponent
                                                actions={'delete'}
                                                collectionName={collectionName}
                                                url={`${endpoint}/provider/?id=${idForDeleteProvider}`}
                                                fetchItems={fetchItems}
                                                setModal={setModalDelete}
                                                btnClassName="btn btn-danger mx-2"
                                                buttonText={'Yes, I’m sure'}
                                            />
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
}
