<?php

namespace App\Http\Controllers;

use App\Models\PromoAd;
use App\Models\Discount;
use Illuminate\Http\Request;

class MarketingController extends Controller
{
    /**
     * ÌáÈ ÇáÅÚáÇäÇÊ ÇáÊÑæíÌíÉ ÇáäÔØÉ (áæÇÌåÉ ÇáÊØÈíÞ)
     */
    public function getActiveAds()
    {
        $ads = PromoAd::where('is_active', true)->get();
        return response()->json($ads);
    }

    /**
     * ÅäÔÇÁ ÅÚáÇä ÊÑæíÌí (ÅÏÇÑÉ)
     */
    public function storeAd(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'image' => 'required|image|max:2048',
            'link' => 'nullable|url'
        ]);

        $path = $request->file('image')->store('promo_ads', 'public');

        $ad = PromoAd::create([
            'title' => $request->title,
            'image_path' => $path,
            'link' => $request->link,
            'is_active' => true
        ]);

        return response()->json(['message' => 'Êã ÅäÔÇÁ ÇáÅÚáÇä ÈäÌÇÍ', 'ad' => $ad], 201);
    }

    /**
     * ÅäÔÇÁ ÎÕã ÇÓÊÑÇÊíÌí (ÅÏÇÑÉ)
     */
    public function storeDiscount(Request $request)
    {
        $request->validate([
            'course_id' => 'required|exists:courses,id',
            'user_id' => 'nullable|exists:users,id',
            'percentage' => 'required|numeric|min:1|max:100',
            'starts_at' => 'nullable|date',
            'ends_at' => 'nullable|date|after_or_equal:starts_at'
        ]);

        $discount = Discount::create($request->all());

        return response()->json(['message' => 'Êã ÅÖÇÝÉ ÇáÎÕã ÈäÌÇÍ', 'discount' => $discount], 201);
    }
}
