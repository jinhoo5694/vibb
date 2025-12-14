'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Typography,
  Box,
  useTheme,
} from '@mui/material';
import { useLanguage } from '@/contexts/LanguageContext';

interface ReportDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (reason: string, detail?: string) => void;
  targetType: 'comment' | 'post';
}

const reportReasons = {
  ko: [
    { value: 'spam', label: '스팸/광고' },
    { value: 'abuse', label: '욕설/비하' },
    { value: 'inappropriate', label: '부적절한 내용' },
    { value: 'misinformation', label: '허위 정보' },
    { value: 'copyright', label: '저작권 침해' },
    { value: 'other', label: '기타' },
  ],
  en: [
    { value: 'spam', label: 'Spam/Advertisement' },
    { value: 'abuse', label: 'Abuse/Harassment' },
    { value: 'inappropriate', label: 'Inappropriate content' },
    { value: 'misinformation', label: 'Misinformation' },
    { value: 'copyright', label: 'Copyright violation' },
    { value: 'other', label: 'Other' },
  ],
};

export const ReportDialog: React.FC<ReportDialogProps> = ({
  open,
  onClose,
  onSubmit,
  targetType,
}) => {
  const theme = useTheme();
  const { language } = useLanguage();
  const [selectedReason, setSelectedReason] = useState('');
  const [detail, setDetail] = useState('');

  const handleSubmit = () => {
    if (selectedReason) {
      onSubmit(selectedReason, detail);
      setSelectedReason('');
      setDetail('');
      onClose();
    }
  };

  const handleClose = () => {
    setSelectedReason('');
    setDetail('');
    onClose();
  };

  const reasons = language === 'ko' ? reportReasons.ko : reportReasons.en;
  const targetLabel = targetType === 'comment'
    ? (language === 'ko' ? '댓글' : 'comment')
    : (language === 'ko' ? '게시글' : 'post');

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 600 }}>
        {language === 'ko' ? `${targetLabel} 신고하기` : `Report ${targetLabel}`}
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {language === 'ko'
            ? '신고 사유를 선택해주세요.'
            : 'Please select a reason for reporting.'}
        </Typography>
        <RadioGroup
          value={selectedReason}
          onChange={(e) => setSelectedReason(e.target.value)}
        >
          {reasons.map((reason) => (
            <FormControlLabel
              key={reason.value}
              value={reason.value}
              control={<Radio size="small" />}
              label={reason.label}
              sx={{
                '& .MuiFormControlLabel-label': {
                  fontSize: '0.9rem',
                },
              }}
            />
          ))}
        </RadioGroup>
        {selectedReason === 'other' && (
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder={
              language === 'ko'
                ? '상세 내용을 입력해주세요...'
                : 'Please provide more details...'
            }
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            sx={{ mt: 2 }}
          />
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} color="inherit">
          {language === 'ko' ? '취소' : 'Cancel'}
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="error"
          disabled={!selectedReason}
        >
          {language === 'ko' ? '신고하기' : 'Report'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
