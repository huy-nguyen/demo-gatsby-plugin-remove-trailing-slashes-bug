/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

 // You can delete this file if you're not using it

const path = require('path');
const {createFilePath} = require('gatsby-source-filesystem');

exports.onCreateNode = ({node, getNode, boundActionCreators}) => {
  const {createNodeField} = boundActionCreators;
  if (node.internal.type === 'MarkdownRemark') {
    const basePath = node.fileAbsolutePath;
    const slug = createFilePath({node, getNode, basePath});
    createNodeField({
      node,
      name: 'slug',
      value: slug,
    })
  }
}

const singleBlogPostQuery = `
  query SingleBlogPostQuery {
    allMarkdownRemark {
      edges {
        node {
          id
          fields {
            slug
          }
        }
      }
    }
  }
`

exports.createPages = ({graphql, boundActionCreators}) => {
  const {createPage} = boundActionCreators;
  return new Promise((resolve) => {
    graphql(singleBlogPostQuery).then(result => {
      result.data.allMarkdownRemark.edges.forEach(({node}) => {
        createPage({
          path: node.fields.slug,
          component: path.resolve('./src/templates/BlogPost.jsx'),
          context: {
            id: node.id,
          }
        })
      })
      resolve();
    })
  })
}
