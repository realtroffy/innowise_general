package com.innowise.imageservice.service;

import com.innowise.imageservice.dto.CommentRequestDto;
import com.innowise.imageservice.dto.CommentResponseDto;
import com.innowise.imageservice.dto.ImageRequestDto;
import com.innowise.imageservice.dto.ImageResponseDto;
import com.innowise.imageservice.dto.PaginatedSliceResponseDto;
import org.springframework.web.multipart.MultipartFile;

public interface ImageService {

    ImageResponseDto upload(String userId, ImageRequestDto imageRequestDto, MultipartFile imageFile);

    ImageResponseDto getById(Long imageId);

    PaginatedSliceResponseDto<ImageResponseDto> getAllByUserId(String userId, int page, int size);

    PaginatedSliceResponseDto<ImageResponseDto> getAll(int page, int size);

    String setOrRemoveLike(String userId, Long imageId);

    CommentResponseDto addComment(String userId, Long imageId, CommentRequestDto commentRequestDto);

    void deleteComment(String userId, Long imageId, Long commentId);

    CommentResponseDto updateComment(String userId, Long imageId, Long commentId, CommentRequestDto commentRequestDto);
}
