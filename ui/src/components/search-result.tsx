
import React from 'react';
import { Img } from 'react-image'

import PurpleFolder from '../assets/images/pur-dir.svg';
import GoogleDoc from '../assets/images/google-doc.svg';
import Docx from '../assets/images/docx.svg';
import Pptx from '../assets/images/pptx.svg';
import DefaultUserImage from '../assets/images/user.webp';
import Calendar from '../assets/images/calendar.svg';

import { DataSourceType } from '../data-source';
import { BsFillCheckCircleFill } from 'react-icons/bs';
import { RiGitRepositoryLine } from 'react-icons/ri';
import { GoAlert } from 'react-icons/go';

export interface TextPart {
    content: string
    bold: boolean
}

export enum ResultType {
    Docment = "document",
    Message = "message",
    Comment = "comment",
    Person = "person",
    Issue = "issue",
    GitPr = "git_pr"
}

export enum FileType {
    Docx = "docx",
    Pptx = "pptx",
    GoogleDoc = "doc",
}

export enum Status {
    Open = "open",
    Closed = "closed",
    InProgress = "in_progress"
}

export interface SearchResultDetails {
    type: ResultType
    data_source: string
    title: string
    author: string
    author_image_url: string
    author_image_data: string
    time: string
    content: TextPart[]
    score: number
    location: string
    platform: string
    file_type: FileType
    status: Status
    url: string
    child: SearchResultDetails
}


export interface SearchResultProps {
    resultDetails: SearchResultDetails
    dataSourceType: DataSourceType
}

export const SearchResult = (props: SearchResultProps) => {
    return (
        <div className="mb-4 pt-2">
            {props.resultDetails.type !== ResultType.Comment &&
                <span className="relative text-sm float-right text-white right-2 top-2">{props.resultDetails.score.toFixed(2)}%</span>}
            <div className="flex flex-row items-start">
                {getBigIcon(props)}
                <p className='w-11/12 p-2 pt-0 ml-1 text-[#A3A3A3] text-sm font-poppins'>
                    <div className='flex flex-row items-center justify-start'>
                        {props.resultDetails.type === ResultType.Issue &&
                            <span className='mr-[6px] px-[7px] py-[1px] font-poppins font-medium text-[15px] bg-[#392E58] text-[#8F76C6] rounded-lg'>
                                ISSUE
                            </span>
                        }
                        <a className="text-[24px] text-[#A78BF6] text-xl font-poppins font-medium hover:underline hover:cursor-pointer"
                            href={props.resultDetails.url} rel="noreferrer" target='_blank'>
                            {props.resultDetails.title}
                        </a>
                        {
                            props.resultDetails.type === ResultType.Comment && (
                                <span className='flex flex-row items-center justify-center ml-2 mt-[5px]'>
                                    Commented {getDaysAgo(props.resultDetails.time)}
                                </span>
                            )     
                        }
                        {
                            props.resultDetails.type === ResultType.Message && (
                                <span className='flex flex-row items-center justify-center ml-2 mt-[5px]'>
                                    Sent {getDaysAgo(props.resultDetails.time)}
                                </span>
                            )     
                        }
                        {props.resultDetails.type === ResultType.Issue &&
                            <span className='flex flex-row items-center ml-2 px-[7px] py-[1px] font-poppins font-medium text-[15px] bg-[#392E58] text-[#8F76C6] rounded-lg'>
                                {props.resultDetails.status === Status.Open ?
                                    <GoAlert className='h-[14px] fill-[#ff9f2b]'></GoAlert> :
                                    <BsFillCheckCircleFill className='h-[14px] fill-[#41b11b]'></BsFillCheckCircleFill>
                                }
                                <span className='ml-1'>{props.resultDetails.status === Status.Open ? 'Open' : 'Closed'}</span>
                            </span>
                        }
                        {props.resultDetails.type === ResultType.Docment && props.resultDetails.file_type !== null &&
                            <span className='m-[6px] px-[7px] py-[1px] font-poppins font-medium text-[15px] bg-[#392E58] text-[#8F76C6] rounded-lg'>
                                {props.resultDetails.file_type.toUpperCase()}
                            </span>
                        }
                    </div>
                    {props.resultDetails.type !== ResultType.Comment && <span className="flex flex-row text-[16px] mb-4 mt-[6px] font-source-sans-pro font-semibold text-[#8F76C6]">
                        <span className="flex flex-row items-center leading-[17px] px-[5px] py-[2px] bg-[#382E56] rounded-[5px] ml-0 text-[#8F76C6]">
                            {
                                props.resultDetails.type === ResultType.Docment && <img alt="purple-folder"
                                    className="h-[12px]" src={PurpleFolder}></img>
                            }
                            {
                                props.resultDetails.type === ResultType.Issue &&
                                <RiGitRepositoryLine className='h-[14px] mt-[1px] mr-[2px]'></RiGitRepositoryLine>
                            }
                            <span className='text-[15x]'>
                                {props.resultDetails.type === ResultType.Docment && ' / '}
                                {props.resultDetails.type === ResultType.Message && '#'}
                                {props.resultDetails.location} </span>
                        </span>
                        {
                        props.resultDetails.type !== ResultType.Message &&
                            <span className="ml-1 flex flex-row items-center">
                                <Img alt="author" className="inline-block ml-[6px] mr-2 h-4 rounded-xl"
                                    src={[props.resultDetails.author_image_url, props.resultDetails.author_image_data, DefaultUserImage]}></Img>
                                <span className='capitalize'>{props.resultDetails.author} </span>
                            </span>
                        }
                        {props.resultDetails.child === null && props.resultDetails.type !== ResultType.Message && DateSpan(props)}
                        <span className="flex flex-row items-center">
                            &thinsp; |&thinsp;
                            <img alt="file-type" className="inline ml-2 mx-1  h-[12px] w-[12px] grayscale-[0.55]"
                                src={props.dataSourceType.image_base64}></img>
                            <span className="ml-[2px] ">{props.dataSourceType.display_name}</span>
                        </span>
                    </span>}
                    {
                        <span>
                            {props.resultDetails.content.map((text_part, index) => {
                                return (
                                    <span key={index} style={{ wordBreak: 'break-word' }} className={(text_part.bold ? 'font-bold text-white' : '') +
                                        " text-md font-poppins font-medium"}>
                                        {text_part.content}
                                    </span>
                                )
                            })}
                        </span>
                    }
                    {props.resultDetails.child &&
                        <div className='relative left-[-60px]'>
                            <span className={'left-5 -top-3 h-8 w-[1px] bg-[#66548D] absolute'}></span>
                            <div className='top-[15px] relative'>
                                <SearchResult resultDetails={props.resultDetails.child} dataSourceType={props.dataSourceType}></SearchResult>
                            </div>
                        </div>
                    }
                </p >
            </div >
        </div >
    );
}

function DateSpan(props: SearchResultProps) {
    const time = getFormattedDate(props.resultDetails.time);
    return (
        <span className='flex flex-row items-center ml-1'>
            <Img alt="author" className="inline-block ml-[6px] mr-1 h-4"
                src={Calendar}></Img>
            <span>&thinsp;
                {props.resultDetails.type === ResultType.Message ? 'Sent ' : 'Updated '}
                {time}</span>
        </span>
    )
}

function getDaysAgo(time: string) {
    let date = new Date(time);
    let now = new Date();
    let diff = Math.abs(now.getTime() - date.getTime());
    let days =  Math.floor(diff / (1000 * 3600 * 24));

    if (days === 0) {
        return 'today';
    } else  if (days === 1) {
        return '1 day ago';
    } else {
        return days + ' days ago';
    }
}


function getFormattedDate(time: string) {
    let date = new Date(time);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}


function getBigIcon(props: SearchResultProps) {
    let containingClasses = "";
    let containingImage = "";
    let onTopImage = "";
    switch (props.resultDetails.type) {
        case ResultType.Docment:
        case ResultType.Issue:
        case ResultType.GitPr:
            if (props.resultDetails.file_type === null) {
                containingImage = props.dataSourceType.image_base64;
            } else {
                onTopImage = props.dataSourceType.image_base64;
                switch (props.resultDetails.file_type) {
                    case FileType.Docx:
                        containingImage = Docx;
                        break;
                    case FileType.Pptx:
                        containingImage = Pptx;
                        break;
                    case FileType.GoogleDoc:
                        containingImage = GoogleDoc;
                        break;
                }
            }
            break;
        case ResultType.Message:
            containingClasses = "rounded-full"
            containingImage = props.resultDetails.author_image_data ? props.resultDetails.author_image_data : props.resultDetails.author_image_url;
            onTopImage = props.dataSourceType.image_base64;
            break;
        case ResultType.Comment:
            containingClasses = "rounded-full"
            containingImage = props.resultDetails.author_image_data ? props.resultDetails.author_image_data : props.resultDetails.author_image_url;
            break;
    }
    if (onTopImage !== "") {
        return (
            <div className="mt-2 mr-[10px] drop-shadow-[0_0_25px_rgba(212,179,255,0.15)]">
                <Img height={"45px"} width={"45px"} className={containingClasses} alt="file-type" src={[containingImage, DefaultUserImage]} />
                <img alt="file-type" className="company-logo rounded-full p-[3px] h-[24px] w-[24px] absolute -right-[5px] -bottom-[5px] bg-white" src={onTopImage}></img>
            </div>
        )
    } else {
        return <img alt="file-type" className={"mt-2 mr-2 h-[40px] w-[40px] drop-shadow-[0_0_25px_rgba(212,179,255,0.15)] " + containingClasses}
            src={containingImage}></img>
    }
}