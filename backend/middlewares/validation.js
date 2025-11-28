const validateTask = (req, res, next) => {
    const { id, petId, type } = req.body;
    if (!id || !petId || !type) {
        return res.status(400).json({
            success: false,
            error: "Missing required fields: id, petId, type are required",
        });
    }
    next();
};

const validatePet = (req, res, next) => {
    const { id, name, species } = req.body;
    if (!id || !name || !species) {
        return res.status(400).json({
            success: false,
            error: "Missing required fields: id, name, species are required",
        });
    }
    next();
};

module.exports = { validateTask, validatePet };
