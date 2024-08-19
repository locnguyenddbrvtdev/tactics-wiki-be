module.exports = class Test1724050160410 {
  async up(queryRunner) {
    await queryRunner.query(`
            INSERT INTO sets (ordinal, mutator, name, "isPublished")
            VALUES
              (1, 'TFTSet1', '{"en_US": "Set 1", "vi_VN": "Mùa 1"}', false),
              (2, 'TFTSet2', '{"en_US": "Set 2", "vi_VN": "Mùa 2"}', false),
              (3, 'TFTSet3', '{"en_US": "Set 3", "vi_VN": "Mùa 3"}', false),
              (4, 'TFTSet4', '{"en_US": "Set 4", "vi_VN": "Mùa 4"}', false),
              (5, 'TFTSet5', '{"en_US": "Set 5", "vi_VN": "Mùa 5"}', false),
              (6, 'TFTSet6', '{"en_US": "Set 6", "vi_VN": "Mùa 6"}', false),
              (7, 'TFTSet7', '{"en_US": "Set 7", "vi_VN": "Mùa 7"}', false),
              (8, 'TFTSet8', '{"en_US": "Set 8", "vi_VN": "Mùa 8"}', false),
              (9, 'TFTSet9', '{"en_US": "Set 9", "vi_VN": "Mùa 9"}', false),
              (10, 'TFTSet10', '{"en_US": "Set 10", "vi_VN": "Mùa 10"}', false),
              (11, 'TFTSet11', '{"en_US": "Set 11", "vi_VN": "Hoạ Thế Chi Linh"}', false),
              (12, 'TFTSet12', '{"en_US": "Magic N Mayhem", "vi_VN": "Hỗn Loạn Huyền Diệu"}', true);
          `);
  }

  async down(queryRunner) {
    await queryRunner.query(`DELETE FROM sets WHERE ordinal BETWEEN 1 AND 12;`);
  }
};
