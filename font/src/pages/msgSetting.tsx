import { useEffect, useState, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../store';
import { setPageTitle } from '../store/themeConfigSlice';

import { DataTable } from 'mantine-datatable';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { Dialog, Transition } from '@headlessui/react';
import { Tab } from '@headlessui/react';
import 'react-quill/dist/quill.snow.css';

import React from 'react';

import MsgProvider from '../components/msgSystem/provider';
import MsgChannel from '../components/msgSystem/channel';
import MsgType from '../components/msgSystem/type';
import MsgTemplate from '../components/msgSystem/template';
// dynamic import
// const MsgProvider = React.lazy(() => import('../components/msgSystem/provider'));
// const MsgChannel = React.lazy(() => import('../components/msgSystem/channel'));
// const MsgType = React.lazy(() => import('../components/msgSystem/type'));
// const MsgTemplate = React.lazy(() => import('../components/msgSystem/template'));

const msgSetting = () => {
    const [isLoaded, setIsLoaded] = useState(false);
    const isDark = useSelector((state: IRootState) => state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode);
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

    const [loading] = useState(false);
    const [currentTabName, setCurrentTabName] = useState('');

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Message Setting'));
    });

    return isLoaded ? (
        <div className="loader">s</div>
    ) : (
        <div>
            <h1 className="font-bold text-xl">
                System Setting / Message{' '}
                {currentTabName === 'Provider' ? 'Provider' : currentTabName === 'Channel' ? 'Channel' : currentTabName === 'Type' ? 'Type' : currentTabName === 'Template' ? 'Template' : ''}
            </h1>
            <Tab.Group>
                <Tab.List className="mt-3 flex w-full ">
                    <Tab as={Fragment}>
                        {({ selected }) => (
                            <button
                                onClick={() => {
                                    setCurrentTabName('Provider');
                                }}
                                className={`${
                                    selected ? 'border-b !border-primary text-primary !outline-none' : ''
                                } -mb-[1px] font-bold flex items-center border-transparent p-5 py-3 before:inline-block hover:border-b hover:!border-primary hover:text-primary`}
                            >
                                Provider
                            </button>
                        )}
                    </Tab>
                    <Tab as={Fragment}>
                        {({ selected }) => (
                            <button
                                onClick={() => {
                                    setCurrentTabName('Channel');
                                }}
                                className={`${
                                    selected ? 'border-b !border-primary text-primary !outline-none' : ''
                                } -mb-[1px] font-bold flex items-center border-transparent p-5 py-3 before:inline-block hover:border-b hover:!border-primary hover:text-primary`}
                            >
                                Channel
                            </button>
                        )}
                    </Tab>
                    <Tab as={Fragment}>
                        {({ selected }) => (
                            <button
                                onClick={() => setCurrentTabName('Type')}
                                className={`${
                                    selected ? 'border-b !border-primary text-primary !outline-none' : ''
                                } -mb-[1px] font-bold flex items-center border-transparent p-5 py-3 before:inline-block hover:border-b hover:!border-primary hover:text-primary`}
                            >
                                Type
                            </button>
                        )}
                    </Tab>
                    <Tab as={Fragment}>
                        {({ selected }) => (
                            <button
                                onClick={() => setCurrentTabName('Template')}
                                className={`${
                                    selected ? 'border-b !border-primary text-primary !outline-none' : ''
                                } -mb-[1px] font-bold flex items-center border-transparent p-5 py-3 before:inline-block hover:border-b hover:!border-primary hover:text-primary`}
                            >
                                Template
                            </button>
                        )}
                    </Tab>
                </Tab.List>

                <Tab.Panels>
                    {/* Provider content */}
                    <Tab.Panel>
                        <MsgProvider />
                    </Tab.Panel>

                    {/* Channel content */}
                    <Tab.Panel>
                        <MsgChannel />
                    </Tab.Panel>

                    {/* Type content */}
                    <Tab.Panel>
                        <MsgType />
                    </Tab.Panel>

                    {/* Template content */}
                    <Tab.Panel>
                        <MsgTemplate />
                    </Tab.Panel>
                </Tab.Panels>
            </Tab.Group>
        </div>
    );
};

export default msgSetting;
