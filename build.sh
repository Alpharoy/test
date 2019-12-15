#!/bin/bash

build(){
  echo 'Start Build:'

  case $1 in
    dev)
        #研发环境
        build_dev
        ;;
    test)
        #测试环境
        build_dev
        ;;
    pre)
        #预发布环境
        build_prod
        ;;
    prod)
        #生产环境
        build_prod
        ;;
    *)
        echo "Usage: sh $0 build {dev|test|pre|prod}"
    esac
}

build_dev(){
  echo 'DEV'

  #检查是否安装 npm
  if ! command -v yarn >/dev/null 2>&1; then
        echo '命令 yarn 不存在, 请安装后执行本脚本'
        exit 7
  fi

  #npm 安装vue.js依赖
  yarn install

  #编译vue.js
  yarn run dev

  #移除依赖包和源码，减少空间
  rm -rf node_modules/ src/
}

build_prod(){
  echo 'PROD'

  #检查是否安装 npm
  if ! command -v npm >/dev/null 2>&1; then
        echo '命令 npm 不存在, 请安装后执行本脚本'
        exit 7
  fi

  #npm 安装Node JS依赖
  yarn install

  #编译vue.js
  yarn run prod

  #移除依赖包和源码，减少空间
  rm -rf node_modules/ src/
}

getconfig(){
  config_files='.env'
  echo $config_files
}

createdir(){
  echo '创建相关目录'
}

case $1 in
    build)
        build $2
        ;;
    getconfig)
        getconfig
        ;;
    *)
        echo "Usage: sh $0 {build|getconfig}"
esac
