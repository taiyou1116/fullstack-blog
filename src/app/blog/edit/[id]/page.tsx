"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import toast, { Toaster } from 'react-hot-toast';

// 読み込んだブログのtitle, descriptionを返す
const getBlogById = async (id:number) => {
  const res = await fetch(`/api/blog/${id}`);
  const data = await res.json();
  return data.post;
}

const editBlog = async (title: string | undefined, description: string | undefined, id:number) => {
  const res = await fetch(`/api/blog/${id}`, {
    method: "PUT",
    body: JSON.stringify({ title, description, id }),
    headers: {
      "Content-Type": "application/json",
    }
  })
  
  return res.json();
}

const deleteBlog = async (id:number) => {
    const res = await fetch(`/api/blog/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      }
    })

    if (!res.ok) { // HTTPステータスコードが 200 OK でない場合
      const text = await res.text(); // レスポンスをテキストとして読み取る
      console.error(`Error: ${text}`); // エラー出力
      throw new Error('サーバーエラーが発生しました');
    }
  
    // レスポンスが200 OKの場合のみJSON解析を試みる
    const data = await res.json();
    return data;
  }

export default function EditPost ({ params }: { params: { id: number } }) {
  const router = useRouter();
  const titleRef = useRef<HTMLInputElement | null>(null);
  const descriptionRef = useRef<HTMLTextAreaElement | null>(null);
  
  useEffect(() => {
    getBlogById(params.id).then((data) => {
        console.log(data);
        if (titleRef.current && descriptionRef.current) {
          titleRef.current.value = data.title;
          descriptionRef.current.value = data.description;
        }
        
    }).catch((err) => {
        toast.error(err + "エラーが発生しました");
    });
    
    toast.remove();
  }, [params.id])


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = editBlog(titleRef.current?.value, descriptionRef.current?.value, params.id);
    toast.promise(
      res,
      {
        loading: 'Editing...',
        success: <b>Edit!</b>,
        error: <b>Could not edit.</b>,
      }
    );
    await res;
    router.push("/");
    router.refresh();
  }

  const handleDelete = async () => {
    const res = deleteBlog(params.id);
    toast.promise(
      res,
        {
          loading: 'Deleting...',
          success: <b>Delete!</b>,
          error: <b>Could not delete.</b>,
        }
    );
    await res;
    router.push("/");
    router.refresh();
  }

  return (
    <>
    <Toaster />
    <div className="w-full m-auto flex my-4">
      <div className="flex flex-col justify-center items-center m-auto">
        <p className="text-2xl text-slate-500 font-bold p-3">ブログの編集 🚀</p>
        <form onSubmit={(e) => handleSubmit(e)}>
          <input
            ref={titleRef}
            placeholder="タイトルを入力"
            type="text"
            className="rounded-md px-4 w-full py-2 my-2"
          />
          <textarea
            ref={descriptionRef}
            placeholder="記事詳細を入力"
            className="rounded-md px-4 py-2 w-full my-2"
          ></textarea>
          <button className="font-semibold px-4 py-2 shadow-xl bg-slate-300 rounded-lg m-auto hover:bg-slate-500">
            更新
          </button>
        </form>
        <button onClick={() => handleDelete()} className="ml-2 font-semibold px-4 py-2 shadow-xl bg-red-400 rounded-lg m-auto hover:bg-red-500">
          削除
        </button>
      </div>
    </div>
    </>
  )
}