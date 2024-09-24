const bcrypt = require('bcrypt');

async function hashPassword(plainPassword) {
    const saltRounds = 10; // 可以根据需要调整
    try {
        const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
        console.log('Hashed Password:', hashedPassword);
        return hashedPassword;
    } catch (error) {
        console.error('Error hashing password:', error);
        throw error;
    }
}

// 示例
hashPassword('userPassword123')
    .then(hashedPassword => {
        // 将 hashedPassword 存储到数据库
    });

    async function verifyPassword(plainPassword, hashedPassword) {
        try {
            const match = await bcrypt.compare(plainPassword, hashedPassword);
            if (match) {
                console.log('Password is valid!');
                return true;
            } else {
                console.log('Password is invalid!');
                return false;
            }
        } catch (error) {
            console.error('Error verifying password:', error);
            throw error;
        }
    }
    
    // 示例
    const hashedPasswordFromDB = '存储在数据库中的加密密码';
    verifyPassword('userPassword123', hashedPasswordFromDB)
        .then(isValid => {
            if (isValid) {
                // 密码验证成功，执行相应操作
            } else {
                // 密码验证失败，处理错误
            }
        });
    
