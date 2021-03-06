'use-strict';
{
  const templates = {
    articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
    articleTagLink: Handlebars.compile(document.querySelector('#template-article-tag-link').innerHTML),
    articleAuthorLink: Handlebars.compile(document.querySelector('#template-article-author-link').innerHTML),
    tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
    authorListLink: Handlebars.compile(document.querySelector('#template-author-list-link').innerHTML),
  };

  const titleClickHandler = function(event){
    const clickedElement = this;
    event.preventDefault();
    console.log('Link was clicked!');
    const activeLinks = document.querySelectorAll('.titles a.active');
    const activeArticles = document.querySelectorAll('.posts article.active');
    const articleSelector = clickedElement.getAttribute('href');
    console.log('articleSelector:', articleSelector);
    const targetArticle = document.querySelector(articleSelector);
    console.log('targetArticle:', targetArticle);
    for(let activeLink of activeLinks){
      activeLink.classList.remove('active');
    }
    clickedElement.classList.add('active');
    console.log('clickedElement:', clickedElement);
    for (let activeArticle of activeArticles) {
      activeArticle.classList.remove('active');
    }
    targetArticle.classList.add('active');
  };

  const optArticleSelector = '.post',
    optTitleSelector = '.post-title',
    optTitleListSelector = '.titles',
    optArticleTagsSelector = '.post-tags .list',
    optArticleAuthorSelector = '.post-author';
  optTagsListSelector = '.tags.list',
  optAuthorListSelector = '.authors.list',
  optCloudClassCount = 5,
  optCloudClassPrefix = 'tag-size-';

  function generateTitleLinks(customSelector = ''){
    const titleList = document.querySelector(optTitleListSelector);
    console.log('titleList:', titleList);
    titleList.innerHTML = '';
    const articles = document.querySelectorAll(optArticleSelector + customSelector);
    for(let article of articles){
      const articleId = article.getAttribute('id');
      const articleTitle = article.querySelector(optTitleSelector).innerHTML;
      const linkHTMLData = {id: articleId, title: articleTitle};
      const linkHTML = templates.articleLink(linkHTMLData);
      console.log('linkHTML:', linkHTML);
      titleList.innerHTML = titleList.innerHTML + linkHTML;
      const links = document.querySelectorAll('.titles a');
      console.log('links', links);
      for (let link of links) {
        link.addEventListener('click', titleClickHandler);
      }
    }
  }

  generateTitleLinks();

  function generateTags(){
    const articles = document.querySelectorAll(optArticleSelector);
    for (let article of articles) {
      const tagWrapper = article.querySelector(optArticleTagsSelector);
      tagWrapper.innerHTML = '';
      const articleTags = article.getAttribute('data-tags');
      console.log('articleTags:', articleTags);
      const articleTagsArray = articleTags.split(' ');
      console.log('articleTagsArray:', articleTagsArray);
      for (let tag of articleTagsArray) {
        const linkHTMLData = {id: tagWrapper, title: articleTag};
        const linkHTML = templates.articleTagLink(linkHTMLData);
        tagWrapper.innerHTML = tagWrapper.innerHTML + tagHTML;
      }
    }
  }

  generateTags();

  function tagClickHandler(event){
    event.preventDefault();
    const clickedElement = this;
    const href = clickedElement.getAttribute('href');
    const tag = href.replace('#tag-', '');
    const activeTags = document.querySelectorAll('a.active[href^="#tag-"]');
    for (let tag of activeTags) {
      activeTags.classList.remove('active');
    }
    const foundTags = document.querySelectorAll(href);
    for (let tag of foundTags) {
      foundTags.classList.add('active');
    }
    generateTitleLinks('[data-tags~="' + tag + '"]');
  }

  function addClickListenersToTags(){
    const tagLinks = document.querySelector(optArticleTagsSelector).querySelectorAll('a');
    for (let tag of tagLinks) {
      tag.addEventListener(tagLinks, tagClickHandler);
    }
  }

  addClickListenersToTags();

  function generateAuthors(){
    const articles = document.querySelectorAll(optArticleSelector);
    for (let article of articles) {
      const authorWrapper = article.querySelector(optArticleAuthorSelector);
      authorWrapper.innerHTML = '';
      const articleAuthor = article.getAttribute('data-author');
      console.log('articleAuthor:', articleAuthor);
      const linkHTMLData = {id: authorWrapper, title: articleAuthor};
      const linkHTML = templates.articleAuthorLink(linkHTMLData);
      authorWrapper.innerHTML += authorHTML;
    }
  }

  generateAuthors();

  function authorClickHandler(event){
    event.preventDefault();
    const clickedElement = this;
    const href = clickedElement.getAttribute('href');
    const tag = href.replace('#author-', '');
    const activeAuthors = document.querySelectorAll('a.active[href^="#author-"]');
    for (let author of activeAuthors) {
      activeAuthors.classList.remove('active');
    }
    const foundAuthors = document.querySelectorAll(href);
    for (let author of foundAuthors) {
      foundAuthors.classList.add('active');
    }
    generateTitleLinks('[data-author="' + author + '"]');
  }

  function addClickListenersToAuthors(){
    const authorLinks = document.querySelector(optArticleAuthorSelector).querySelectorAll('a');
    for (let author of authorLinks) {
      author.addEventListener(authorLinks, authorClickHandler);
    }
  }

  addClickListenersToAuthors();

  function calculateTagsParams (tags) {
    const params = {max: '0' , min: '999999'};
    for(let tag in tags){
      params.max = Math.max(tags[tag], params.max);
      params.min = Math.min(tags[tag], params.min);
      console.log(tag + ' is used ' + tags[tag] + ' times');
    }
    return params;
  }
  function calculateTagClass(count, params){
    const normalizedCount = count - params.min;
    const normalizedMax = params.max - params.min;
    const percentage = normalizedCount / normalizedMax;
    const classNumber = Math.floor(percentage * (optCloudClassCount - 1) + 1 );
    return classNumber;
  }

  function generateTags () {
    const allTags = {};
    const articles = document.querySelectorAll(optArticleSelector);
    for (let article of articles){
      const tagWrapper = article.querySelector(optArticleTagsSelector);
      tagWrapper.innerHTML = '';
      const articleTags = article.getAttribute('data-tags');
      console.log('articleTags:', articleTags);
      const articleTagsArray = articleTags.split(' ');
      console.log('articleTagsArray:', articleTagsArray);
      articleTagsArray.forEach(item => {
        const linkHTML = '<li><a href="#tag-' + articleTags + '"><span>' + item +'</span></a></li>';
        tagWrapper.innerHTML = tagWrapper.innerHTML + linkHTML;
        if(!allTags[item]){
          allTags[item] = 1;
        } else {
          allTags[item]++;
        }
        console.log(allTags);
      });
    }
    const tagList = document.querySelector(optTagsListSelector);
    const tagsParams = calculateTagsParams(allTags);
    console.log('tagsParams:', tagsParams);
    const allTagsData = {tags: []};
    for(let tag in allTags){
      allTagsData.tags.push({
        tag: tag,
        count: allTags[tag],
        className: calculateTagClass(allTags[tag], tagsParams)
      });
    }
    tagList.innerHTML = templates.tagCloudLink(allTagsData);
    console.log(allTagsData);
  }

  function generateAuthors () {
    let allAuthors = {};
    const articles = document.querySelectorAll(optArticleSelector);
    for (let article of articles){
      const authorsWrapper = article.querySelector(optArticleAuthorSelector);
      authorsWrapper.innerHTML = '';
      const articleAuthors = article.getAttribute('data-author');
      console.log('articleAuthors:', articleAuthors);
      const articleAuthorsArray = articleAuthors.split('  ');
      console.log('articleAuthorsArray:', articleAuthorsArray);
      for (let author of articleAuthorsArray) {
        const linkAuthorsHTML = '<li><a href="#author-' + articleAuthors + '"><span>' + author +'</span></a></li>';
        authorsWrapper.innerHTML = authorsWrapper.innerHTML + linkAuthorsHTML;
        if(!allAuthors[author]){
          allAuthors[author] = 1;
        } else {
          allAuthors[author]++;
        }
      }
    }
    const authorsList = document.querySelector(optAuthorListSelector);
    const allAuthorsData = {authors: []};
    for(let author in allAuthors){
      allAuthorsData.authors.push({
        author: author,
      });
    }
    authorsList.innerHTML = templates.authorListLink(allAuthorsData);
  }

}
