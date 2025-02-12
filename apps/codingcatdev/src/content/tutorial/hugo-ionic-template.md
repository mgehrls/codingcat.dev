---
authors:
  - alex-patterson
cloudinary_convert: false
cover: https://media.codingcat.dev/image/upload/v1616547399/main-codingcatdev-photo/kewwx7rull4s45bdidds.jpg
devto: https://dev.to/codingcatdev/hugo-ionic-template-5e09
excerpt: How to use AJonP's Hugo Ionic Template, while building Algolia Indexes and deploying to Firebase Hosting
hashnode: https://hashnode.codingcat.dev/tutorial-hugo-ionic-template-1
preview: https://codingcat.dev/api/preview?secret=7tjQhb1qQlS3FtyV3b0I&selectionType=tutorial&selectionSlug=hugo-ionic-template&_id=5a6904e2014d499eb99593602495a190
published: published
slug: hugo-ionic-template
start: May 19, 2022
title: Hugo Ionic Template
youtube: https://youtu.be/tgXFNqInA0w
---

> Please note that while working through this tutorial I chose to make branches instead of tags to see if people would enjoy that more. However there was an update to the Victor/Hugo template to start using webpack and I don't want to confuse anyone, so please don't pull the master branch to start.

- master (initial)
- netlify-victor-hugo (moves everything to npm setup)
- complete-lesson-4 (has everything you need to go-live)
- prod (shows the example trigger, as well as moving over to git submodule)

## Official Documentation

[Google Cloud Build - Deploying Artifacts](https://cloud.google.com/cloud-build/docs/configuring-builds/build-test-deploy-artifacts#deploying_artifacts)

## Lesson Steps

1. Clone Lesson 4
2. Add Netlify Victor/Hugo template to project.
3. Update branding.
4. Configure Firebase Hosting
5. Configure Algolia Indexing
6. Configure Google Cloud Build

# Add Netlify Victor/Hugo template to project

## Get the initial setup

You can follow along step-by-step at the [Initial Setup Lesson](https://ajonp.com/lessons/ajonp-hugo-ionic-template), and [YouTube Video](https://www.youtube.com/watch?v=CZmEZ62yMFA).

Or you can start by cloning [Hugo Ionic](https://github.com/AJONPLLC/lesson-4-hugo-ionic.git) from GitHub, we are using a specific branch to start this lesson as the master was for the original lesson.

```bash
git clone --single-branch -b netlify-victor-hugo https://github.com/AJONPLLC/lesson-4-hugo-ionic.git
```

## Structure

- site // Everything in here will be built with hugo
  - content // Pages and collections - ask if you need extra pages
  - data // YAML data files with any data for use in examples
  - layouts // This is where all templates go
    - partials // This is where includes live
    - index.html // The index page
  - static // Files in here ends up in the public folder
- src // Files that will pass through the asset pipeline
  - css // Webpack will bundle imported css seperately
- index.js // index.js is the webpack entry for your css & js assets

## Running Hugo

You can still run this project as a normal hugo site at this point, by running the command while in the site folder.

> Make sure to return to your root folder `cd ..`

## Running Victor/Hugo

There are a few additional requirements at this point that we need to install.

Install the files via npm npm comes with [NodeJs](https://nodejs.org/en/download/)

```bash
npm install
```

Start a browsersync server

```bash
npm start
```

You should see something like:

```
[13:29:18] Starting 'server'...
[Browsersync] Access URLs: --------------------------------------
Local: http://localhost:3000 External: http://192.168.86.23:3000 --------------------------------------
UI: http://localhost:3001 UI External: http://localhost:3001 --------------------------------------
[Browsersync] Serving files from: ./dist
[13:29:34] Starting 'hugo'... [ '-d', '../dist', '-s', 'site', '-v' ]

```

## Update to use Victor/Hugo asset pipeline

Why this becomes powerful is that you can start installing all of your favorite npm modules and importing them like you would with most non-static projects.

Copy the `baseof.html` file from our theme to our base directory so that we can override the themes file.

```bash
mkdir site/layouts && mkdir site/layouts/_default && cp site/themes/ajonp-hugo-ionic/layouts/_default/baseof.html site/layouts/_default/baseof.html

```

> Remember to edit baseof.html in your files not the themes (or they won't be saved.)

Now we are going to edit the baseof.html and remove these two lines (just before `</head>`)

```html
<link href="{{ "/css/custom.css" | absURL }}" rel="stylesheet" as="style" type="text/css"> <link
href="{{ "/css/syntax.css" | absURL }}" rel="stylesheet" as="style" type="text/css">
```

These were originally coming from our site folder, both in theme and direct, we are going to update this file to allow for victor/hugo to handle this requirement. So we will replace that line in the html with

Also while we are in /site/layouts_default/baseof.html add a reference right above `</body>`.

You should now see the theme change back to the stock Ionic Blue color, as we have not moved our styles to the source location. However there will be a new addition to the console in debugger.

Move our `custom.css` file to the source folder.

```bash
mv site/static/css/custom.css src/css/imports/custom.css
```

Now we need to import this file into our src/css/main.css

```scss
/* You can use import statements to include partials: */
@import 'imports/reset.css';
@import 'imports/custom.css';

/* Or add your statements here: */
body {
	font-family: sans-serif;
	font-size: 1em;
	text-align: center;
}
```

## Example of loading software to use

Lets try adding something simple that we might use like lodash

```bash
npm install lodash
```

Now this will be avalabel for us to use in our app.js or any other file we would like to reference the module.

`src/js/app.js`

```
console.log(</span><span class="token template-string token">Subscribe to ???? <a href="https://www.youtube.com/channel/UCnKZ8gEb78zXKMi1ns-IQ2g">AJonP's Youtube Channel</a></span><span class="token template-string token template-punctuation">); var _ = require('lodash'); console.log(_.VERSION);
```

In the console you will now see the current version of lodash.

# Update branding

I am sure that you love looking at AJ on your favicon and manifest (he likes being there ????). But you probably want to update a few things.

## icons

In the `themes/ajonp-hugo-ionic/static/icons` folder you will find several images that can be used for your manifest file. I typically use [www.favicon-generator.org](https://www.favicon-generator.org/) to update these files based on an image that I create. You can now add all of these images to `site/static/icons` so they can be referenced later in manifest.json or anywhere in your site.

## manifest.json

You should update this file to reflect any changes in your icons folder.

```json
{
    "name": "AJonP",
    "manifest_version": 1,
    "short_name": "AJonP",
    "start_url": "/",
    "scope": "/",
    "display": "standalone",
    "background_color": "#FFFFFF",
    "theme_color": "#3D2D4D",
    "gcm_sender_id": "103953800507",
    "icons": [{
                "src": "/icons/android-icon-36x36.webp",
                "sizes": "36x36",
                "type": "image/png",
                "density": "0.75"
            }, ...

```

## Favicons

If you are using an older browser the main icon that goes in your browser will be used by `/site/static/favicon.ico`. Otherwise you should hvae larger images spelled out in the `themes/ajonp-hugo-ionic/layouts/partials/head.html`, they look similar to this...

```html
<link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.webp" />
<link rel="icon" type="image/png" sizes="96x96" href="/icons/favicon-96x96.webp" />
<link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.webp" />
```

Please feel free to update the entire head.html partial, or any of the layouts for that matter AJ doesn't mind too much :P.

## Configure Firebase Hosting

Please make sure to checkout [Google Cloud Firebase CI/CD](https://ajonp/lessons/2-firebase-ci) for a great example.

### Quick steps

```bash
firebase init
```

Select Hosting

![https://media.codingcat.dev/image/upload/v1657636629/main-codingcatdev-photo/89b2779b-3216-4da7-a16c-883a42e47031.png](https://media.codingcat.dev/image/upload/v1657636629/main-codingcatdev-photo/89b2779b-3216-4da7-a16c-883a42e47031.png)

Pick your project

![https://media.codingcat.dev/image/upload/v1657636633/main-codingcatdev-photo/182ddf6a-d724-4ffc-b5df-666e22b59dc7.png](https://media.codingcat.dev/image/upload/v1657636633/main-codingcatdev-photo/182ddf6a-d724-4ffc-b5df-666e22b59dc7.png)

Set the output folder to dist, and select no for rewrite all urls.

![https://media.codingcat.dev/image/upload/v1657636634/main-codingcatdev-photo/338de572-a979-4403-99e6-ba0dfa65e44b.png](https://media.codingcat.dev/image/upload/v1657636634/main-codingcatdev-photo/338de572-a979-4403-99e6-ba0dfa65e44b.png)

## Configure Algolia Indexing

First signup on [www.algolia.com/](https://www.algolia.com/).

### Algolia Signup

About You! [Algolia Signup about](https://res.cloudinary.com/ajonp/image/upload/q_auto/v1544652567/ajonp-ajonp-com/4-lesson-hugo-ionic/oal4d7yzzwkxdovyoxov.webp)

Your Datacenter! [Algolia Your Data Center](https://res.cloudinary.com/ajonp/image/upload/q_auto/v1544652629/ajonp-ajonp-com/4-lesson-hugo-ionic/ohsotz84xgeeodrunlkr.webp)

Your Project Type - Depends on what you are making but I would choose Media for most sites.

![https://media.codingcat.dev/image/upload/v1657636629/main-codingcatdev-photo/cce27077-97ca-4b00-9ba2-8439092b0d72.jpg](https://media.codingcat.dev/image/upload/v1657636629/main-codingcatdev-photo/cce27077-97ca-4b00-9ba2-8439092b0d72.jpg)

Pick Dashboard once you get here

![https://media.codingcat.dev/image/upload/v1657636630/main-codingcatdev-photo/edd2cb19-d3a1-4893-a498-243042333208.png](https://media.codingcat.dev/image/upload/v1657636630/main-codingcatdev-photo/edd2cb19-d3a1-4893-a498-243042333208.png)

You can run the tutorial or just skip for now.

Now select Indicies, and Create Index! [Indicies](https://res.cloudinary.com/ajonp/image/upload/q_auto/v1544652891/ajonp-ajonp-com/4-lesson-hugo-ionic/hswlxadds5sens0rb0s5.webp)

Example of an Index Creation

![https://media.codingcat.dev/image/upload/v1657636634/main-codingcatdev-photo/8beede07-53ad-4862-b7aa-9989100a372b.png](https://media.codingcat.dev/image/upload/v1657636634/main-codingcatdev-photo/8beede07-53ad-4862-b7aa-9989100a372b.png)

API Keys are where we can now get the remainder of our information that we will need.

![https://media.codingcat.dev/image/upload/v1657636629/main-codingcatdev-photo/1c3d4fd7-4bd1-4884-84b2-a1e4fec27526.png](https://media.codingcat.dev/image/upload/v1657636629/main-codingcatdev-photo/1c3d4fd7-4bd1-4884-84b2-a1e4fec27526.png)

## Add Algolia for Search

> In your site/config.toml file you will see params.algolia. These are used just for the search bar to make the search happen...do not use your Admin API KEY!!

```
 # Search Only [params.algolia] appId = "C1OJ9HOH3E" apiKey = "f61b2bf395516ca150fc7b75281190ab" indexName = "example"
```

You will notice a section later when we use Cloud Depoy that will require you to add

- ALGOLIA_APP_ID
- ALGOLIA_ADMIN_KEY
- ALGOLIA_INDEX_NAME
- ALGOLIA_INDEX_FILE

## Configure Google Cloud Build

An important part to any project is setting up a solid CI/CD pipeline (Continuous Integration/Continuous Delivery). I still believe that Google Cloud offers the best pricing for any size development team! If you are a very small shop you will run builds for free, for a very long time.

## Docker Images / Cloud Build

> I found out recently from [Mike McDonald](https://twitter.com/asciimike), that there are a great set of [Google Cloud Platform Community Images](https://github.com/GoogleCloudPlatform/cloud-builders-community). They should work really well most of the time, but you might have to be careful on versioning. For instance Hugo is currently at .49 and I need something above .50 for my site. This is why I remain using my own Docker files.

### cloudbuild.yaml

This file controls all of the steps necessary throughout our build process. You can manually execute each step locally to see that everything works as expected on your docker images.

```
steps:
# Build the hugo image
- name: 'gcr.io/cloud-builders/docker' args: [ 'build', '-t', 'gcr.io/$PROJECT_ID/hugo', './dockerfiles/hugo' ]
# Git the submodules, run npm install, hugo build
- name: 'gcr.io/$PROJECT_ID/hugo' args: ['bash', './deploy.sh']
# Algolia index update
- name: 'gcr.io/cloud-builders/npm' args: [ 'run','algolia'] env:
  - 'ALGOLIA_APP_ID=${_ALGOLIA_APP_ID}'
  - 'ALGOLIA_ADMIN_KEY=${_ALGOLIA_ADMIN_KEY}'
  - 'ALGOLIA_INDEX_NAME=${_ALGOLIA_INDEX_NAME}'
  - 'ALGOLIA_INDEX_FILE=${_ALGOLIA_INDEX_FILE}'
# sw-precache
- name: 'gcr.io/cloud-builders/npm' args: [ 'run','generate-service-worker']
# Build the firebase image
- name: 'gcr.io/cloud-builders/docker' args: [ 'build', '-t', 'gcr.io/$PROJECT_ID/firebase', './dockerfiles/firebase' ]
# Deploy to firebase
- name: 'gcr.io/$PROJECT_ID/firebase' args: ['deploy', '--token', '${_FIREBASE_TOKEN}']
# Optionally you can keep the build images
# images: ['gcr.io/$PROJECT_ID/hugo', 'gcr.io/$PROJECT_ID/firebase']

```

Please checkout all of the [cloud builder images](https://cloud.google.com/cloud-build/docs/cloud-builders).

### Step 0 and 1

Docker is an available image we will use this to create our own image instance from our Dockerfile in dockerfiles/hugo/Dockerfile. The Google Cloud build image Node seems to offer a lot of the tools we will need already so we just add Hugo into this Dockerfile.

```docker
FROM node
LABEL author="developer@ajonp.com"

# Set debconf to run non-interactively
RUN echo 'debconf debconf/frontend select Noninteractive' | debconf-set-selections

# Install base dependencies
RUN apt-get update && apt-get upgrade -y
RUN apt-get install -y -q --no-install-recommends \
        apt-transport-https \
        asciidoc \
        build-essential \
        ca-certificates \
        curl \
        git \
        libssl-dev \
        python \
        python-pygments \
        rsync \
        software-properties-common \
        devscripts \
        autoconf \
        ssl-cert \
    && apt-get clean

# Download and install hugo
ENV HUGO_VERSION 0.51
ENV HUGO_BINARY hugo_${HUGO_VERSION}_Linux-64bit.deb

#ADD https://github.com/spf13/hugo/releases/download/v${HUGO_VERSION}/${HUGO_BINARY} /tmp/hugo.deb
RUN curl -sL -o /tmp/hugo.deb \
    https://github.com/spf13/hugo/releases/download/v${HUGO_VERSION}/${HUGO_BINARY} && \
    dpkg -i /tmp/hugo.deb && \
    rm /tmp/hugo.deb

# confirm hugo
RUN hugo env

```

The next step in this will execute our local file `deploy.sh` so that we can execute a few key commands. The purests out there will say that we can execute both the git command and the npm commands using the two external images. I find that it is faster to not spin up a new image since we are sitting in a node image already for npm. The git submodule also is a bit of a pain because you have to go through a complicated process (from what I have gathered) to either link github to google source repos or create tokens for one off logins.

```bash
#!/bin/bash echo -e
Adding Submodules...
git submodule init git submodule update --recursive --remote echo -e
Installing via npm...
npm install echo -e
Building via npm...
npm run build
```

1. Update any submodules (like our theme).
2. Install all of the victor/hugo dependencies (or all other).
3. Run the build command which will push all of our files to the `/dist` folder.

### Step 2

Now I know everything I said up above about npm image...sorry for any confusion. However, I thought it was better to leave these npm commands seperate from the deploy as they are not required and can be easily commented out of your builds.

In the case of this evn variables, we can again leave these out of the public git repos of the world and only have them stored wihtin Google Cloud builder [variable values](https://cloud.google.com/cloud-build/docs/configuring-builds/substitute-variable-values), using the notation `${_variable}`.

```
# Algolia index update
- name: 'gcr.io/cloud-builders/npm'
  args: [ 'run','algolia']
  env:
  - 'ALGOLIA_APP_ID=${_ALGOLIA_APP_ID}'
  - 'ALGOLIA_ADMIN_KEY=${_ALGOLIA_ADMIN_KEY}'
  - 'ALGOLIA_INDEX_NAME=${_ALGOLIA_INDEX_NAME}'
  - 'ALGOLIA_INDEX_FILE=${_ALGOLIA_INDEX_FILE}'

```

This is again using `atomic-algolia` to look at our newly created `dist/algolia.json` file and compares that to what is in the Algolia index.

### Step 3

Want a PWA still? Then we need to have a service worker. No AJ not an Animal service worker.

```yaml
# sw-precache
- name: 'gcr.io/cloud-builders/npm' args: [ 'run','generate-service-worker']

```

### Step 4 and 5

> Please make sure to checkout [Google Cloud Firebase CI/CD](https://ajonp/lessons/2-firebase-ci) for a great example.

The biggest item that you need to remember here is adding your token to the cloud builder.'

```yaml
# Build the firebase image
- name: 'gcr.io/cloud-builders/docker'
  args: ['build', '-t', 'gcr.io/$PROJECT_ID/firebase', './dockerfiles/firebase']
# Deploy to firebase
- name: 'gcr.io/$PROJECT_ID/firebase'
  args: ['deploy', '--token', '${_FIREBASE_TOKEN}']
```

Now you should have your full [Hugo](https://gohugo.io/) site up and running on [Firebase Hosting](https://firebase.google.com/products/hosting/)!
