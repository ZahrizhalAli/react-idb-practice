import Dexie from 'dexie';
import React, { useEffect, useState } from 'react';

function Main() {
  const db = new Dexie('ReactDexieDB');

  db.version(1).stores({
    posts: 'id, title, content, file',
  });

  db.open().catch((err) => {
    console.log(err.stack || err);
  });

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState('');
  const [posts, setPosts] = useState('');
  const [uniqueid, setUniqueid] = useState(1);
  const [isupdate, setIsupdate] = useState(false);
  const [userid, setUserid] = useState(null);

  const getFile = (e) => {
    let reader = new FileReader();
    reader.readAsDataURL(e[0]);
    reader.onload = (e) => {
      setFile(reader.result);
    };
  };

  const deletePost = async (id) => {
    db.posts.delete(id);
    let allPosts = await db.posts.toArray();
    setPosts(allPosts);
  };

  const getPostInfo = (e) => {
    //
    e.preventDefault();

    if (title && content && file) {
      let post = {
        id: uniqueid,
        title,
        content,
        file,
      };
      db.posts.add(post).then(async () => {
        let allPosts = await db.posts.toArray();
        setPosts(allPosts);
      });
      setUniqueid(uniqueid + 1);
    }
    setContent('');
    setTitle('');
    setFile('');
  };

  useEffect(() => {
    getPosts();
  }, [posts]);

  const getPosts = async () => {
    let allPosts = await db.posts.toArray();
    setPosts(allPosts);
  };

  const updatePost = (e) => {
    //
    console.log('update');
    e.preventDefault();

    if (isupdate) {
      let updatedPost = {
        id: userid,
        title,
        content,
        file,
      };
      db.posts.update(userid, updatedPost).then((updated) => {
        if (updated) {
          alert('Updated');
        } else {
          alert('there was an error in updating blog');
        }
      });
      setIsupdate(false);
      setTitle('');
      setContent('');
      setFile('');
      getPosts();
    }
  };
  const handleUpdate = (id, title, content, file) => {
    setIsupdate(!isupdate);
    setUserid(id);
    setTitle(title);
    setContent(content);
    setFile(file);
  };
  return (
    <>
      {JSON.stringify({ title, content, file, isupdate })}
      <form onSubmit={isupdate && isupdate ? updatePost : getPostInfo}>
        <div className="control">
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="control">
          <label>Content</label>
          <textarea
            name="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <div className="control">
          <label htmlFor="cover" className="cover">
            Choose a file
          </label>
          <input
            type="file"
            id="cover"
            name="file"
            onChange={(e) => getFile(e.target.files)}
          />
        </div>
        {isupdate ? (
          <input type="submit" value="Update" />
        ) : (
          <input onSubmit={getPostInfo} type="submit" value="Submit" />
        )}
      </form>

      <div className="postsContainer">
        {posts &&
          posts.map((p) => {
            return (
              <>
                <div key={p.id} className="post">
                  <div style={{ backgroundImage: 'url(' + p.file + ')' }} />
                  <h2>{p.title}</h2>
                  <p>{p.content}</p>
                  <button className="delete" onClick={() => deletePost(p.id)}>
                    Delete
                  </button>
                  <button
                    className="delete"
                    onClick={() =>
                      handleUpdate(p.id, p.title, p.content, p.file)
                    }
                  >
                    {isupdate ? 'Cancel' : 'Edit'}
                  </button>
                </div>
              </>
            );
          })}
      </div>
    </>
  );
}

export default Main;
