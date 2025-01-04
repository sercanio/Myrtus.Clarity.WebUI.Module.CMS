import React from 'react';
import type { IModuleDefinition } from '../IModuleDefinition';
import CmsContents from './pages/CmsContents';
import ContentAddPage from './pages/ContentAddPage';
import { addCmsEndpoints } from './store/services/cmsApi';  // Updated import
import { FileTextOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';

const sideMenuItems: MenuProps['items'] = [
  {
    key: 'content-management',
    icon: React.createElement(FileTextOutlined),
    label: 'Content Management',
    children: [
      {
        key: '/cms/contents',
        icon: React.createElement(EditOutlined),
        label: 'Contents',
      },
      {
        key: '/cms/contents/add',
        icon: React.createElement(PlusOutlined),
        label: 'Add Content',
      },
    ],
  },
];

/**
 * The module definition implementing your IModuleDefinition interface.
 */
const cmsModule: IModuleDefinition = {
  name: 'cms',
  routes: [
    {
      path: '/cms/contents',
      element: React.createElement(CmsContents),
    },
    {
      path: '/cms/contents/add',
      element: React.createElement(ContentAddPage),
    },
  ],
  sideMenuItems,

  initStore: () => {
    /**
     * This is the key: we inject the endpoints dynamically 
     * only when the CMS module is "initialized".
     */
    addCmsEndpoints();
  },
};

export default cmsModule;
