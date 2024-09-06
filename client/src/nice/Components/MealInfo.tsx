import React, { useState } from 'react';
import styled from 'styled-components';
import { searchMeal } from './schoolApi';

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
`;

const MealInfoBox = styled.div`
  margin-top: 20px;
  border: 1px solid #ddd;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 5px;
`;

const MealType = styled.h4`
  color: #007bff;
  margin-bottom: 10px;
`;

const MenuList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const MenuItem = styled.li`
  margin-bottom: 5px;
  padding: 5px;
  background-color: #ffffff;
  border-radius: 3px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const NutritionInfo = styled.div`
  margin-top: 10px;
  background-color: #e9ecef;
  padding: 10px;
  border-radius: 3px;
`;

const NutritionItem = styled.span`
  font-size: 0.9em;
  color: #495057;
  margin-right: 10px;
`;

interface MealInfoProps {
  schoolInfo: any;
}

const MealInfo: React.FC<MealInfoProps> = ({ schoolInfo }) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [mealInfo, setMealInfo] = useState<any[]>([]);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    try {
      const result = await searchMeal(schoolInfo, date);
      if (result.length > 0) {
        setMealInfo(result);
        setError('');
      } else {
        setMealInfo([]);
        setError('해당 날짜의 급식 정보가 없습니다.');
      }
    } catch (error) {
      setMealInfo([]);
      setError('급식 정보 검색 중 오류가 발생했습니다.');
    }
  };

  const formatMenu = (menuString: string) => {
    return menuString
      .replace(/<br\s*\/?>/g, '\n')
      .split('\n')
      .map(item => item.trim())
      .filter(item => item !== '');
  };

  const formatNutrition = (nutritionString: string) => {
    return nutritionString.split('<br/>').map(item => {
      const [nutrient, amount] = item.split(' : ');
      return { nutrient, amount };
    });
  };

  return (
    <Container>
      <h2>급식 정보 검색</h2>
      <Input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <Button onClick={handleSearch}>검색</Button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {mealInfo.length > 0 && (
        <MealInfoBox>
          <h3>급식 정보 ({date}):</h3>
          {mealInfo.map((meal, index) => (
            <div key={index}>
              <MealType>{meal.MMEAL_SC_NM}</MealType>
              <MenuList>
                {formatMenu(meal.DDISH_NM).map((item, idx) => (
                  <MenuItem key={idx}>{item}</MenuItem>
                ))}
              </MenuList>
              <NutritionInfo>
                <NutritionItem>칼로리: {meal.CAL_INFO}</NutritionItem>
                {formatNutrition(meal.NTR_INFO).map((item, idx) => (
                  <NutritionItem key={idx}>
                    {item.nutrient}: {item.amount}
                  </NutritionItem>
                ))}
              </NutritionInfo>
            </div>
          ))}
        </MealInfoBox>
      )}
    </Container>
  );
};

export default MealInfo;