#!/bin/bash
while :
do
    rm web_cam_data/1.jpg
    ln -s `pwd`/1.jpg `pwd`/web_cam_data/1.jpg
    sleep 1
    rm web_cam_data/1.jpg
    ln -s `pwd`/2.jpg `pwd`/web_cam_data/1.jpg
    sleep 1

done
