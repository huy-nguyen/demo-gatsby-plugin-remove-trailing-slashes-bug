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
    const summary = node.frontmatter.summary;
    createNodeField({
      node,
      name: 'slug',
      value: slug,
    })
    createNodeField({
      node,
      name: 'summary',
      value: summary,
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

// Implement the Gatsby API “onCreatePage”. This is
// called after every page is created.
exports.onCreatePage = ({ page, boundActionCreators }) => {
  const { createPage, deletePage } = boundActionCreators;
  return new Promise(resolve => {
    const oldPage = Object.assign({}, page);
    // Remove trailing slash unless page is /
    page.path = _path => (_path === `/` ? _path : _path.replace(/\/$/, ``));
    if (page.path !== oldPage.path) {
      // Replace new page with old page
      deletePage(oldPage);
      createPage(page);
    }
    resolve();
  });
};
