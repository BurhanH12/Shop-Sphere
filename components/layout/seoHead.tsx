import React from "react";
import Head from "next/head";
import logo from "/public/logo.png";
import favicon from "/public/favicon.jpg";

const SeoHead = ({ ...props }: any) => {
  return (
    <Head>
      {props?.cononcial_url ?? (
        <link rel="canonical" href={`https://${props?.cononcial_url}`} />
      )}
      <title>
        {props?.isLanding ? props?.title : ` Resource Hub | ${props?.title}`}
      </title>
      <meta property="og:title" content={props?.title} key="title" />
      <meta name="description" content={`${props?.description}`} />
      <meta property="og:title" content={props?.title} />
      <meta property="og:site_name" content={`${props?.domain_name}`}></meta>
      <meta name="og:description" content={props?.description}></meta>
      <meta property="og:image:height" content="1260" />
      <meta property="og:image:width" content="2400" />
      <meta property="og:title" content="Resource Hub" />
      <meta property="og:url" content={`${props?.domain_name}`}></meta>
      <meta property="og:type" content="website"></meta>
      <meta
        name="keywords"
        content={`${props?.domain_name}, hiring, self assessment`}
      ></meta>
      <meta property="og:site_name" content="Resource Hub" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:description" content={`${props?.description}`} />
      <meta name="twitter:title" content={`${props?.title} title`} />
      <meta name="robots" content="noindex,nofollow" />
      <link rel="icon" href={`${favicon.src}`} />
    </Head>
  );
};

// This gets called on every request

export default SeoHead;
