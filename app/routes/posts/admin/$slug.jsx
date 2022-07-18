import { redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { getPost, updatePost } from "~/models/post.server";
import { marked } from "marked";
import { useState } from "react";

export const action = async ({ request }) => {
  const formData = await request.formData();

  const title = formData.get("title");
  const slug = formData.get("slug");
  const markdown = formData.get("markdown");

  await updatePost({ title, slug, markdown });

  return redirect(`/posts/admin/`);
};

export const loader = async ({ params }) => {
  const post = await getPost(params.slug);
  const html = marked(post.markdown);
  return json({ post, html });
};

const inputClassName = `w-full rounded border border-gray-500 px-2 py-1 text-lg`;

export default function Post() {
  const { post, html } = useLoaderData();
  const [isEdit, setIsEdit] = useState(false);

  return isEdit ? (
    <Form method="post">
      <p>
        <label>
          Post Title:
          <input
            type="text"
            name="title"
            defaultValue={post.title}
            className={inputClassName}
          />
        </label>
      </p>
      <p>
        <label>
          Post Slug:
          <input
            type="text"
            name="slug"
            defaultValue={post.slug}
            className={inputClassName}
          />
        </label>
      </p>
      <p>
        <label htmlFor="markdown">Markdown:</label>
        <br />
        <textarea
          id="markdown"
          rows={20}
          name="markdown"
          defaultValue={post.markdown}
          className={`${inputClassName} font-mono`}
        />
      </p>
      <p className="text-right">
        <button
          onClick={() => setIsEdit(false)}
          className="mr-2 rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400 disabled:bg-blue-300"
        >
          Cancel Edit
        </button>
        <button
          type="submit"
          className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400 disabled:bg-blue-300"
        >
          Update Post
        </button>
      </p>
    </Form>
  ) : (
    <>
      <div dangerouslySetInnerHTML={{ __html: html }} />
      <button
        onClick={() => setIsEdit(true)}
        className="m-2 m-2 h-10 h-12 rounded-lg bg-indigo-700 px-5 px-6 text-lg text-indigo-100 transition-colors duration-150 hover:bg-indigo-800"
      >
        Edit
      </button>
    </>
  );
}
