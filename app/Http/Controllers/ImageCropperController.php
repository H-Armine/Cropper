<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Image;

class ImageCropperController extends Controller
{
    public function index()
    {
        $images = Image::all();
        return view('image-cropper')->with(compact('images'));
    }

    public function store(Request $request)
    {
        $name = uniqid() . '.png';
        $path = '/upload/' . $name;
        $request->file('image')->move(public_path('/upload'), $name);
        Image::create([
            'title' => $path
        ]);
        return response()->json(['success'=>'Crop Image Saved/Uploaded Successfully using jQuery and Ajax In Laravel']);
    }
}
