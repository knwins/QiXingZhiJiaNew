import { PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { FormattedMessage, useIntl } from '@umijs/max';
import { Button, message } from 'antd/lib';
import React, { useRef, useState } from 'react';
import ArticleModel from './components/ArticleModel';
import { ArticleItem } from './data';
import { addArticle, getArticle, queryArticleList, removeArticle, updateArticle } from './service';

const Notice: React.FC = () => {
  const [done, setDone] = useState<boolean>(false);

  //edit/add
  const [visible, setVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<Partial<ArticleItem> | undefined>(undefined);

  //国际化
  const intl = useIntl();

  const paginationProps = {
    showSizeChanger: true,
    showQuickJumper: true,
  };

  const handleGetArticle = async (id: any) => {
    if (!id) return true;
    try {
      const loadingHiddle = message.loading(
        intl.formatMessage({
          id: 'pages.tip.loading',
        }),
        0,
      );
      const params = {
        id: id,
      };
      const { data, success } = await getArticle(params);
      loadingHiddle();
      if (success) {
        setCurrentRow(data);
        setVisible(true);
        return true;
      }
      return false;
    } catch (error) {
      message.error(
        intl.formatMessage({
          id: 'pages.tip.error',
        }),
      );
      return false;
    }
  };

  /**
   * 添加节点
   *
   * @param fields
   */

  const handleSubmit = async (fields: ArticleItem) => {
    try {
      const action = fields?.id ? 'update' : 'add';
      const loadingHiddle = message.loading(
        intl.formatMessage({
          id: 'pages.tip.loading',
        }),
        0,
      );

      if (action == 'add') {
        const { success } = await addArticle({ ...fields });
        loadingHiddle();
        if (success) {
          message.success(
            intl.formatMessage({
              id: 'pages.tip.success',
            }),
          );
          setVisible(false);
          setCurrentRow(undefined);
          if (actionRef.current) {
            actionRef.current.reloadAndRest?.();
          }
        }
        return;
      } else if (action == 'update') {
        const { success } = await updateArticle({ ...fields });
        loadingHiddle();
        if (success) {
          message.success(
            intl.formatMessage({
              id: 'pages.tip.success',
            }),
          );
          setVisible(false);
          setCurrentRow(undefined);
          if (actionRef.current) {
            actionRef.current.reloadAndRest?.();
          }
        }

        return;
      }
    } catch (error) {
      message.error(
        intl.formatMessage({
          id: 'pages.tip.error',
        }),
      );
      setVisible(false);
      return;
    }
  };

  const handleRemove = async (selectedRows: ArticleItem) => {
    if (!selectedRows) return true;
    try {
      const loadingHiddle = message.loading(
        intl.formatMessage({
          id: 'pages.tip.loading',
        }),
        0,
      );
      const { success } = await removeArticle({
        id: selectedRows.id,
      });
      loadingHiddle();
      if (success) {
        message.success(
          intl.formatMessage({
            id: 'pages.tip.success',
          }),
        );
        actionRef.current?.reload?.();
        return true;
      }
      return false;
    } catch (error) {
      message.error(
        intl.formatMessage({
          id: 'pages.tip.error',
        }),
      );
      return false;
    }
  };

  const handleDone = () => {
    setDone(false);
    setVisible(false);
    setCurrentRow(undefined);
  };

  const columns: ProColumns<ArticleItem>[] = [
    {
      title: '缩略图',
      dataIndex: 'thumbImage',
      valueType: 'image',
      align: 'center',
      width: '100px',
    },

    {
      title: <FormattedMessage id="pages.create.time" />,
      dataIndex: 'createTime',
      valueType: 'dateTime',
      align: 'center',
      width: '100px',
    },

    {
      title: <FormattedMessage id="pages.article.type" />,
      dataIndex: ['articleType', 'name'],
      valueType: 'text',
      width: '100px',
    },
    {
      title: <FormattedMessage id="pages.article.title" />,
      dataIndex: 'title',
      valueType: 'text',
      width: '360px',
    },

    {
      title: <FormattedMessage id="pages.option" />,
      dataIndex: 'option',
      valueType: 'option',
      width: '120px',
      align: 'center',
      render: (_, record) => [
        <a
          key="edit"
          onClick={() => {
            handleGetArticle(record.id);
          }}
        >
          <FormattedMessage id="pages.edit" />
        </a>,
        <a
          key="delete"
          onClick={() => {
            handleRemove(record);
            actionRef.current?.reloadAndRest?.();
          }}
        >
          <FormattedMessage id="pages.delete" />
        </a>,
      ],
    },
  ];

  return (
    <div>
      <PageContainer>
        <ProTable<ArticleItem>
          headerTitle=""
          actionRef={actionRef}
          rowKey={(record) => record.id}
          search={false}
          pagination={paginationProps}
          toolBarRender={() => [
            <Button
              type="primary"
              key="primary"
              onClick={() => {
                setVisible(true);
                setCurrentRow(undefined);
              }}
            >
              <PlusOutlined /> <FormattedMessage id="pages.new" />
            </Button>,
          ]}
          request={queryArticleList}
          columns={columns}
        />
      </PageContainer>

      <ArticleModel
        done={done}
        visible={visible}
        current={currentRow}
        onDone={handleDone}
        onSubmit={handleSubmit}
      />
    </div>
  );
};
export default Notice;
