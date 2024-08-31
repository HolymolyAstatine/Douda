import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import SchoolSearch from './api';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('SchoolSearch 컴포넌트', () => {
  it('학교 검색 입력 필드와 버튼이 렌더링됩니다', () => {
    render(<SchoolSearch />);
    expect(screen.getByPlaceholderText('학교 이름 입력')).toBeInTheDocument();
    expect(screen.getByText('학교 검색')).toBeInTheDocument();
  });

  it('학교 검색 결과를 표시합니다', async () => {
    const mockSchools = {
      schoolInfo: [
        {},
        {
          row: [
            { SCHUL_NM: '테스트 학교', SD_SCHUL_CODE: '1234567', ATPT_OFCDC_SC_CODE: 'B10' }
          ]
        }
      ]
    };

    mockedAxios.get.mockResolvedValueOnce({ data: mockSchools });

    render(<SchoolSearch />);
    
    const input = screen.getByPlaceholderText('학교 이름 입력');
    fireEvent.change(input, { target: { value: '테스트 학교' } });
    
    const searchButton = screen.getByText('학교 검색');
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText('테스트 학교')).toBeInTheDocument();
    });
  });

  it('학교 선택 시 선택된 학교 정보를 표시합니다', async () => {
    const mockSchools = {
      schoolInfo: [
        {},
        {
          row: [
            { SCHUL_NM: '테스트 학교', SD_SCHUL_CODE: '1234567', ATPT_OFCDC_SC_CODE: 'B10' }
          ]
        }
      ]
    };

    mockedAxios.get.mockResolvedValueOnce({ data: mockSchools });

    render(<SchoolSearch />);
    
    const input = screen.getByPlaceholderText('학교 이름 입력');
    fireEvent.change(input, { target: { value: '테스트 학교' } });
    
    const searchButton = screen.getByText('학교 검색');
    fireEvent.click(searchButton);

    await waitFor(() => {
      const schoolItem = screen.getByText('테스트 학교');
      fireEvent.click(schoolItem);
    });

    expect(screen.getByText('선택된 학교 정보:')).toBeInTheDocument();
    expect(screen.getByText('학교명: 테스트 학교')).toBeInTheDocument();
    expect(screen.getByText('학교코드: 1234567')).toBeInTheDocument();
    expect(screen.getByText('교육청코드: B10')).toBeInTheDocument();
  });
});