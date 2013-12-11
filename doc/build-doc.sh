#!/bin/bash

HERE=$(cd "$(dirname $0)" && pwd)
STYLE_DIR="${HERE}/../public/stylesheets"
DOC_DIR="${HERE}"
APP_NAME="mock-monkey"

function copy_dir
{
    local from_dir=$1
    local to_dir=$2
    for f in "${from_dir}"/*
    do
        if [ -d ${f} ]; then
            local name="$(basename ${f})"
            echo "${f} is dir, name=${name}"
            mkdir -p "${to_dir}/${name}"
            copy_dir ${f} "${to_dir}/${name}"
        else
            cp ${f} ${to_dir}
        fi
    done
}

function generate_styledocco
{
    local doc_name=$1
    local src_dir=$2
    local out_dir=${DOC_DIR}/html/styledocco
    local include=${DOC_DIR}/stylesheets/tek-doc.css

    mkdir -p ${out_dir}

    rm -f ${out_dir}/*.*

    copy_dir ${src_dir} ${out_dir}

    rm -f ${out_dir}/*.css
    rm -f ${out_dir}/*/*.css

    cd ${out_dir}
    styledocco -n "${doc_name}" -o ${out_dir} --include ${include}
    rm -f ${out_dir}/*.less
    rm -f ${out_dir}/*.css
    rm -f ${out_dir}/*/*.less
    rm -f ${out_dir}/*/*.css
}


echo
echo -- build doc start --

generate_styledocco "${APP_NAME}" ${STYLE_DIR}


echo build-doc done!