import React from 'react'
import PropTypes from 'prop-types'
import { graphql, navigate } from 'gatsby'
import Helmet from 'react-helmet'

import { Layout } from '../components/common'
import { MetaData } from '../components/common/meta'

import { useIntl } from "gatsby-plugin-intl"

/**
* Single post view (/:slug)
*
* This file renders a single post and loads all the content.
*
*/

export const localeMap = {
    "fr": "fr",
    "en": "en",
    "es": "es"
};


const Post = ({ data, location }) => {
    const post = data.ghostPost;
    const posts = data.allGhostPost.edges;
    const canonicalLink = post.canonical_url;
    const intl = useIntl();

    let postLocal = post.tags.find(tag => tag.name === localeMap[tag.name]).name
    
    //If we're catching a gatsby-plugin-intl new routes:
    //For a /welcome/ post, it creates
    // - /en/welcome
    // - /fr/welcome
    // - /es/welcome
    if (postLocal !== intl.locale) {

        let postToRedirect = posts.find(({ node }) => {

            //We have to find a intl.locale post with the same canonical url
            let local = node.tags.find(tag => tag.name === localeMap[tag.name]).name
            let findCanonical = false;

            if (intl.locale === 'en') {
                if (local !== 'en') return

                findCanonical = canonicalLink && canonicalLink.includes(node.slug);

                return findCanonical;
            }

            let nodeIsCorrectLocal = local === intl.locale;

            if (!nodeIsCorrectLocal) return

            findCanonical = canonicalLink ? node.canonical_url === canonicalLink : node.canonical_url && node.canonical_url.includes(post.slug);

            return nodeIsCorrectLocal && findCanonical
        })

        if (postToRedirect) {

            //Redirecting to /post.slug/ instead of /en/post.slug/ for default language
            let newUrl = `${intl.locale !== 'en' ? '/' + intl.locale + '/' + postToRedirect.node.slug : '/' + postToRedirect.node.slug}/`

            //TODO navigate & push history precedent
            if (newUrl !== location.pathname) navigate(newUrl, { replace: true })
        }
        else {
            //No post to redirect, this post hasn't been translated
            //Redirecting to local index
            navigate(`/${intl.locale}/`, { replace: true });
        }
    }

    return (
        <>
            <MetaData
                data={data}
                location={location}
                type="article"
            />
            <Helmet>
                <style type="text/css">{`${post.codeinjection_styles}`}</style>
            </Helmet>
            <Layout>
                <div className="container">
                    <article className="content">
                        {post.feature_image ?
                            <figure className="post-feature-image">
                                <img src={post.feature_image} alt={post.title} />
                            </figure> : null}
                        <section className="post-full-content">
                            <h1 className="content-title">{post.title}</h1>

                            {/* The main post content */}
                            <section
                                className="content-body load-external-scripts"
                                dangerouslySetInnerHTML={{ __html: post.html }}
                            />
                        </section>
                    </article>
                </div>
            </Layout>
        </>
    )
}

Post.propTypes = {
    data: PropTypes.shape({
        ghostPost: PropTypes.shape({
            codeinjection_styles: PropTypes.object,
            title: PropTypes.string.isRequired,
            html: PropTypes.string.isRequired,
            feature_image: PropTypes.string,
        }).isRequired,
    }).isRequired,
    location: PropTypes.object.isRequired,
}

export default Post

export const postQuery = graphql`
    query($slug: String!) {
        ghostPost(slug: { eq: $slug }) {
            ...GhostPostFields
        }
        allGhostPost {
            edges {
              node {
                ...GhostPostFields
              }
            }
          }
    }
`
