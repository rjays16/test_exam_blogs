<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class BlogController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Blog::query();
        
        // Search functionality
        if ($request->has('search')) {
            $searchTerm = $request->search;
            $query->where('title', 'LIKE', "%{$searchTerm}%");
        }
        
        $blogs = $query->with('user:id,name')
                      ->orderBy('created_at', 'desc')
                      ->paginate(10);
        
        return response()->json($blogs);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'status' => 'required|in:published,hidden',
        ]);

        if ($validator->fails()) {
            return response(['errors' => $validator->errors()->all()], 422);
        }

        $blog = Blog::create([
            'title' => $request->title,
            'content' => $request->content,
            'status' => $request->status,
            'created_by' => auth()->id(),
        ]);

        return response()->json($blog, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Blog $blog)
    {
        return response()->json($blog->load('user:id,name'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Blog $blog)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'status' => 'required|in:published,hidden',
        ]);

        if ($validator->fails()) {
            return response(['errors' => $validator->errors()->all()], 422);
        }

        $blog->update([
            'title' => $request->title,
            'content' => $request->content,
            'status' => $request->status,
        ]);

        return response()->json($blog);
    }

    /**
     * Update the blog status.
     */
    public function updateStatus(Request $request, Blog $blog)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:published,hidden',
        ]);

        if ($validator->fails()) {
            return response(['errors' => $validator->errors()->all()], 422);
        }

        $blog->update([
            'status' => $request->status,
        ]);

        return response()->json($blog);
    }

    /**
     * Remove the specified resource from storage (soft delete/archive).
     */
    public function destroy(Blog $blog)
    {
        $blog->delete();
        return response()->json(['message' => 'Blog archived successfully']);
    }
}