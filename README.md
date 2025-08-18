# Personal Portfolio & Website

This repository contains the source code for my personal portfolio, blog, and project showcase, built with Jekyll and hosted on GitHub Pages. The site is designed to highlight my professional experience in software engineering, my personal projects, and my adventurous pursuits.

## Features

* **Static Site Generation:** Built with [Jekyll](https://jekyllrb.com/), a simple, blog-aware, static site generator.
* **Modern Theme:** Styled using the highly customizable [Minimal Mistakes](https://mmistakes.github.io/minimal-mistakes/) theme.
* **Hosted on GitHub Pages:** Automatically built and deployed for free.
* **Content Sections:**
    * **Experience & Qualifications:** Details on my software engineering and military careers.
    * **Projects:** A showcase of personal and academic projects.
    * **Adventures:** A checklist tracking my progress on climbing the NH 4000-footers, visiting all 50 states, every National Park, and all MLB ballparks.

## Local Development

To run the site on your local machine, you'll need to have Ruby, Jekyll, and Bundler installed.

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/au5y/top.git](https://github.com/au5y/top.git)
    cd top
    ```

2.  **Install dependencies:**
    This command will install all the required gems from the `Gemfile`.
    ```bash
    bundle install
    ```

3.  **Serve the site:**
    This command builds the site and starts a local server.
    ```bash
    bundle exec jekyll serve
    ```

4.  **Preview the site:**
    Open your web browser and navigate to `http://127.0.0.1:4000` to see a live preview.

## Deployment

This site is configured for automatic deployment through GitHub Pages. Any changes pushed to the `master` branch will trigger a new build and deploy the updated version of the site.