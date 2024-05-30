import {
  ModalForm,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormUploadButton,
} from '@ant-design/pro-form';

import { useIntl } from '@umijs/max';
import { message, Upload } from 'antd/lib';
import type { FC } from 'react';
import { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useRequest } from 'umi';
import { ArticleItem } from '../data';
import { queryArticleTypeList } from '../service';

type ArticleModelProps = {
  done: boolean;
  visible: boolean;
  current: Partial<ArticleItem> | undefined;
  onDone: () => void;
  onSubmit: (values: ArticleItem) => void;
};

const ArticleModel: FC<ArticleModelProps> = (props) => {
  const { done, visible, current, onDone, onSubmit } = props;
  const intl = useIntl();
  const [value, setValue] = useState('');
  const [thumbImage, setThumbImage] = useState('');
  const uploadFileURL = 'https://qixingzhijia.szqws.com:8081/api/file/upload_image';
  //读取分类数据
  const { data } = useRequest(() => {
    return queryArticleTypeList({
      current: 1,
      pageSize: 100,
    });
  });

  const dataListOptions = {};
  dataListOptions[0] = { text: '请选择分类', value: '0' };
  const listData = data || [];
  if (listData) {
    listData.map((item) => {
      dataListOptions[item.id] = {
        text: item.name,
        value: item.id,
      };
    });
  }
  //end

  if (!visible) {
    return null;
  }

  const description = (value: any) => {
    return <ReactQuill theme="snow" defaultValue={value} onChange={setValue} />;
  };

  const handleChange = (info: any) => {

  console.log(info);

    //done
    if (info.file.status === 'done') {
      if (!info.file.response.success) {
        message.error(info.file.response.errorMessage);
      } else {
        setThumbImage(info.file.response.data);
        message.success('上传成功');
      }
    }
    //error
    else if (info.file.status === 'error') {
      message.error(`您没有权限访问`);
    }
  };

  //上传之前验证大小
  const beforeUpload = (file: any) => {
    const isLt2M = (file.size || 0) < 1024 * 1024 * 2;
    if (!isLt2M) {
      message.error('图片不能超过2MB!');
    }
    return isLt2M ? true : Upload.LIST_IGNORE;
  };

  return (
    <ModalForm<ArticleItem>
      visible={visible}
      title={
        done
          ? null
          : `${current?.id ? intl.formatMessage({ id: 'pages.edit' }) : intl.formatMessage({ id: 'pages.new' })}`
      }
      width={640}
      onFinish={async (values) => {
        values.content = value;
        values.thumbImage=thumbImage;
        onSubmit(values);
      }}
      initialValues={current}
      submitter={{
        render: (_, dom) => (done ? null : dom),
      }}
      modalProps={{
        onCancel: () => onDone(),
        destroyOnClose: true,
      }}
    >
      <>
        <ProFormSelect
          name="articleTypeId"
          width="lg"
          label={intl.formatMessage({
            id: 'pages.article.type.name.label',
          })}
          valueEnum={dataListOptions}
          initialValue={current ? current?.articleType?.id + '' : '0'}
        />
        <ProFormText
          name="title"
          label={intl.formatMessage({
            id: 'pages.article.title',
          })}
          width="lg"
          rules={[
            {
              required: true,
            },
          ]}
          placeholder={intl.formatMessage({
            id: 'pages.article.title.placeholder',
          })}
        />

        <ProFormUploadButton
          label="缩略图"
          action={uploadFileURL}
          fieldProps={{
            accept: 'image/png, image/jpeg',
            name: 'imageFile',
            headers: { Token: localStorage.getItem('token') || '' },
            beforeUpload: beforeUpload,
          }}
          onChange={handleChange}
          max={1}
          title="上传"
        />

        <ProFormText name="source" label="作者" width="sm" placeholder="请输入作者或出处" />

        <ProFormTextArea
          name="inro"
          label="内容描述"
          rules={[
            {
              message: intl.formatMessage({
                id: 'pages.article.inro.required',
              }),
              min: 5,
            },
          ]}
          placeholder={intl.formatMessage({
            id: 'pages.article.inro.placeholder',
          })}
        />

        <p>
          {intl.formatMessage({
            id: 'pages.article.content',
          })}
        </p>

        {description(current?.content)}

        <ProFormText name="contentTxtUrl" hidden />
        <ProFormDigit name="id" hidden />
      </>
    </ModalForm>
  );
};

export default ArticleModel;
